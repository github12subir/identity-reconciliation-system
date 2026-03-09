import { Contact } from "@prisma/client";

export const buildResponse = (contacts: Contact[]) => {

  const primary = contacts.find(
    c => c.linkPrecedence === "primary"
  )!;

  const emails = [
    primary.email,
    ...contacts
      .filter(c => c.email && c.email !== primary.email)
      .map(c => c.email)
  ].filter(Boolean);

  const phones = [
    primary.phoneNumber,
    ...contacts
      .filter(c => c.phoneNumber && c.phoneNumber !== primary.phoneNumber)
      .map(c => c.phoneNumber)
  ].filter(Boolean);

  const secondaryIds = contacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  return {
    contact: {
      primaryContactId: primary.id,
      emails: [...new Set(emails)],
      phoneNumbers: [...new Set(phones)],
      secondaryContactIds: secondaryIds
    }
  };
};