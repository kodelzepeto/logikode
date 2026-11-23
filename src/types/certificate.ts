export interface CertificateRecord {
  id: string;
  studentName: string;
  unitNumber: number;
  unitTitle: string;
  dateStr: string;
  issuedAt: number;
  issuer: string;
  issuerUrl: string;
  status: "VALID" | "REVOKED";
  verificationUrl: string;
}
