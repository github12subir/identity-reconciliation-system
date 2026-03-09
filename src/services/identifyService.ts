import prisma from "../prisma/prismaClient";

export const processIdentity = async (email?: string, phoneNumber?: string) => {

  const matchedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  // No existing contact → create primary
  if (matchedContacts.length === 0) {

    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return {
      primaryContact: newContact
    };
  }

  // Oldest contact becomes primary
  const primary = matchedContacts[0];

  const existingEmails = new Set(
    matchedContacts.map(c => c.email).filter(Boolean)
  );

  const existingPhones = new Set(
    matchedContacts.map(c => c.phoneNumber).filter(Boolean)
  );

  // Create secondary if new info found
  if (
    (email && !existingEmails.has(email)) ||
    (phoneNumber && !existingPhones.has(phoneNumber))
  ) {

    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    });

  }

  return {
    primaryContact: primary
  };

};