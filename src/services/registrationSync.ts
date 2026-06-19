export async function syncRegistrationToFirebase(state: any) {
  try {
    const { createMember } = await import("./membersService");
    const newMember = state.members[0]; // Last registered member
    if (newMember) {
      await createMember(newMember);
      console.log("✓ Member saved to Firebase");
    }
  } catch (error) {
    console.error("Failed to save to Firebase:", error);
  }
}
