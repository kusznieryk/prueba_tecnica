export type TestType = 'k167' | 'her2' | 'estrogeno' | 'progesterona';

export interface PatientInfo {
  patientName: string;
  testDate: Date;
  reportNumber: string;
}

export interface TestResults {
  aiCount: number;
  aiTotalCells: number;
  aiPositiveCells: number;
  aiNegativeCells: number;
}

export interface CorrectedResults extends TestResults {
  correctedCount: number;
  correctedTotalCells: number;
  correctedPositiveCells: number;
  correctedNegativeCells: number;
}

export interface TestData {
  id: string;
  testType: TestType;
  patientInfo: PatientInfo;
  originalImage: string;
  processedImage: string;
  aiResults: TestResults;
  correctedResults?: CorrectedResults;
  createdAt: Date;
  updatedAt: Date;
}