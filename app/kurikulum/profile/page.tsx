import ProfileForm from "../../components/ProfileForm";
import { getProfile } from "../../actions/profile";

export const dynamic = "force-dynamic";

export default async function KurikulumProfilePage() {
  const profil = await getProfile();

  if (!profil) {
    return null;
  }

  return <ProfileForm profil={profil} />;
}