export interface JobData {
  title: string;
  company: string;
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  locationType: "Remote" | "On-Site" | "Hybrid";
  content: string;
}
