import prisma from "../prisma/prismaClient";
import { Contact } from "@prisma/client";
import { buildResponse } from "../utils/responseBuilder";

export const processIdentity = async (
  email?: string,
  phoneNumber?: string
) => {

  // 1️⃣ Find initial matches
  const initialMatches = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  // 2️⃣ No match → create primary
  if (initialMatches.length === 0) {

    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return buildResponse([newContact]);
  }

  // 3️⃣ Expand identity graph
  const emails = new Set<string>();
  const phones = new Set<string>();

  initialMatches.forEach(contact => {
    if (contact.email) emails.add(contact.email);
    if (contact.phoneNumber) phones.add(contact.phoneNumber);
  });

  let allContacts: Contact[] = [];
  let foundNew = true;

  while (foundNew) {

    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: { in: Array.from(emails) } },
          { phoneNumber: { in: Array.from(phones) } }
        ]
      }
    });

    foundNew = false;

    for (const contact of contacts) {

      if (!allContacts.find(c => c.id === contact.id)) {

        allContacts.push(contact);

        if (contact.email && !emails.has(contact.email)) {
          emails.add(contact.email);
          foundNew = true;
        }

        if (contact.phoneNumber && !phones.has(contact.phoneNumber)) {
          phones.add(contact.phoneNumber);
          foundNew = true;
        }

      }

    }

  }

  // 4️⃣ Determine oldest primary contact
  let primaryContact = allContacts
    .filter(c => c.linkPrecedence === "primary")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

  // 5️⃣ Merge multiple primaries
  for (const contact of allContacts) {

    if (
      contact.linkPrecedence === "primary" &&
      contact.id !== primaryContact.id
    ) {

      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primaryContact.id
        }
      });

    }

  }

  // 6️⃣ Check if new information exists
  const existingEmails = new Set(
    allContacts.map(c => c.email).filter(Boolean)
  );

  const existingPhones = new Set(
    allContacts.map(c => c.phoneNumber).filter(Boolean)
  );

  let newContactCreated = false;

  if (
    (email && !existingEmails.has(email)) ||
    (phoneNumber && !existingPhones.has(phoneNumber))
  ) {

    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary"
      }
    });

    newContactCreated = true;

  }

  // 7️⃣ Refetch contacts if new one created
  const finalContacts = newContactCreated
    ? await prisma.contact.findMany({
        where: {
          OR: [
            { id: primaryContact.id },
            { linkedId: primaryContact.id }
          ]
        }
      })
    : allContacts;

  return buildResponse(finalContacts);

};