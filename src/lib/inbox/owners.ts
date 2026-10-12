/** Only this Google account can open /inbox. */
const INBOX_OWNERS = ["shanifadhil33@gmail.com"];
export const isInboxOwner = (email: string | null | undefined) => !!email && INBOX_OWNERS.includes(email.toLowerCase());
