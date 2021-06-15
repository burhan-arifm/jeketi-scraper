export default interface Member {
  name: string;
  nickname: string;
  dob: Date;
  bloodtype: string;
  height: number;
  imageUrl: string;
  socialMedias: {
    twitter: string;
    instagram: string;
  };
  team: string;
}
