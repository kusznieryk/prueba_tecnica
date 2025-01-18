import { TestType, TestData, PatientInfo, TestResults } from '../types/testeo';
import { TesteoFilters, PaginationParams, PaginatedResponse } from '../types/filters';

export class TesteoService {
  private static processImage(image: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(image);
      }, 1500);
    });
  }

  private static generateAIResults(): TestResults {
    const totalCells = Math.floor(Math.random() * 1000) + 100;
    const positiveCells = Math.floor(Math.random() * totalCells);
    return {
      aiCount: Math.floor(Math.random() * 100),
      aiTotalCells: totalCells,
      aiPositiveCells: positiveCells,
      aiNegativeCells: totalCells - positiveCells,
    };
  }

  static async analyzeImage(
    testType: TestType,
    image: string,
    patientInfo: PatientInfo
  ): Promise<TestData> {
    const processedImage = await this.processImage(image);
    const aiResults = this.generateAIResults();

    const testData: TestData = {
      id: Date.now().toString(),
      testType,
      patientInfo,
      originalImage: image,
      processedImage: processedImage,
      aiResults,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const existingTests = JSON.parse(localStorage.getItem('tests') || '[]');
    localStorage.setItem('tests', JSON.stringify([...existingTests, testData]));

    return testData;
  }

  static async updateTestResults(
    idTesteo: string,
    correctedResults: TestResults
  ): Promise<TestData | null> {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const testIndex = tests.findIndex((t: TestData) => t.id === idTesteo);

    if (testIndex === -1) return null;

    const updatedTest: TestData = {
      ...tests[testIndex],
      correctedResults: {
        ...correctedResults,
        correctedCount: correctedResults.aiCount,
        correctedTotalCells: correctedResults.aiTotalCells,
        correctedPositiveCells: correctedResults.aiPositiveCells,
        correctedNegativeCells: correctedResults.aiNegativeCells,
      },
      updatedAt: new Date(),
    };

    tests[testIndex] = updatedTest;
    localStorage.setItem('tests', JSON.stringify(tests));

    return updatedTest;
  }


  static getTestById(idTesteo: string): TestData | null {
    const tests = this.getAllTests();
    return tests.data.find((test) => test.id === idTesteo) || null;
  }

  static deleteTest(idTesteo: string): boolean {
    const tests = this.getAllTests();
    const filteredTests = tests.data.filter(test => test.id !== idTesteo);
    localStorage.setItem('tests', JSON.stringify(filteredTests));
    return true;
  }
  static getAllTests(
    filters?: TesteoFilters,
    pagination?: PaginationParams
  ): PaginatedResponse<TestData> {
    let tests: TestData[] = JSON.parse(localStorage.getItem('tests') || '[]');

    if (filters) {
      tests = tests.filter((test) => {
        const matchesName = !filters.patientName || 
          test.patientInfo.patientName
            .toLowerCase()
            .includes(filters.patientName.toLowerCase());

        const matchesReport = !filters.reportNumber ||
          test.patientInfo.reportNumber
            .toLowerCase()
            .includes(filters.reportNumber.toLowerCase());

        const matchesType = !filters.testType || 
          test.testType === filters.testType;

        const testDate = new Date(test.patientInfo.testDate);
        const matchesDateRange =
          (!filters.startDate || testDate >= new Date(filters.startDate)) &&
          (!filters.endDate || testDate <= new Date(filters.endDate));

        return matchesName && matchesReport && matchesType && matchesDateRange;
      });
    }

    tests.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTests = tests.slice(startIndex, endIndex);

    return {
      data: paginatedTests,
      total: tests.length,
      currentPage: page,
      totalPages: Math.ceil(tests.length / limit)
    };
  }

  static searchTesteos(
    searchTerm: string,
    pagination?: PaginationParams
  ): PaginatedResponse<TestData> {
    let tests: TestData[] = JSON.parse(localStorage.getItem('tests') || '[]');

    tests = tests.filter((test) =>
      test.patientInfo.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientInfo.reportNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTests = tests.slice(startIndex, endIndex);

    return {
      data: paginatedTests,
      total: tests.length,
      currentPage: page,
      totalPages: Math.ceil(tests.length / limit)
    };
  }

  static getTestsByType(
    testType: TestType,
    pagination?: PaginationParams
  ): PaginatedResponse<TestData> {
    let tests: TestData[] = JSON.parse(localStorage.getItem('tests') || '[]');
    tests = tests.filter(test => test.testType === testType);

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTests = tests.slice(startIndex, endIndex);

    return {
      data: paginatedTests,
      total: tests.length,
      currentPage: page,
      totalPages: Math.ceil(tests.length / limit)
    };
  }

  static getTestsByDateRange(
    startDate: string,
    endDate: string,
    pagination?: PaginationParams
  ): PaginatedResponse<TestData> {
    let tests: TestData[] = JSON.parse(localStorage.getItem('tests') || '[]');
    
    tests = tests.filter(test => {
      const testDate = new Date(test.patientInfo.testDate);
      return testDate >= new Date(startDate) && testDate <= new Date(endDate);
    });

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTests = tests.slice(startIndex, endIndex);

    return {
      data: paginatedTests,
      total: tests.length,
      currentPage: page,
      totalPages: Math.ceil(tests.length / limit)
    };
  }

}