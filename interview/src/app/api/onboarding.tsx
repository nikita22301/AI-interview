const BASE_URL = "http://localhost:8080/api/auth";

export const onBoardingApi = async (data: {
  email: string;
  location: string;
  company: string;
  portfolioUrl: string;
  targetRole: string;
  experience: string;
  domain: string;
  dreamCompanies: string;
  skills: string[];
  customSkills: string;
  interviewTypes: string[];
  prepTimeline: string;
  extraContext: string;
}) => {
  const res = await fetch(`${BASE_URL}/onBoarding`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};