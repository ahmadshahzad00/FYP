import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Extract text from PDF
export const extractTextFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return null;
  }
};

// Extract Member ID from text using patterns
export const extractMemberIdFromText = (text) => {
  if (!text) return null;

  const patterns = [
    /Member\s*ID\s*[:：]\s*([A-Z0-9-]+)/i,
    /Member\s*ID\s*[:：]\s*([C-M]-?\d{3,4})/i,
    /Member\s*ID\s*[:：]\s*([A-Z0-9]+)/i,
    /Member\s*ID\s*[:：]\s*([A-Z]\d+)/i,
    /Member\s*ID\s*[:：]\s*(\d+)/i,
    /Member\s*ID\s*[:：]\s*([A-Z0-9-]+)/i,
    /Member\s*No\s*[:：]\s*([A-Z0-9-]+)/i,
    /Member\s*Number\s*[:：]\s*([A-Z0-9-]+)/i,
    /Registration\s*No\s*[:：]\s*([A-Z0-9-]+)/i,
    /Reg\s*No\s*[:：]\s*([A-Z0-9-]+)/i,
    /Certificate\s*No\s*[:：]\s*([A-Z0-9-]+)/i,
    /Chamber\s*ID\s*[:：]\s*([A-Z0-9-]+)/i,
    /C-\d{3,4}/i,
    /M-\d{3,4}/i,
    /SCCI-\d{3,6}/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const memberId = match[1] || match[0];
      return memberId.trim();
    }
  }

  return null;
};

// Extract member details from text
export const extractMemberDetailsFromText = (text) => {
  const details = {
    memberId: null,
    companyName: null,
    memberClass: null,
    address: null,
    phone: null,
    email: null,
  };

  // Extract Member ID
  details.memberId = extractMemberIdFromText(text);

  // Extract Company Name
  const companyPatterns = [
    /Company\s*Name\s*[:：]\s*([^\n]+)/i,
    /Business\s*Name\s*[:：]\s*([^\n]+)/i,
    /Firm\s*Name\s*[:：]\s*([^\n]+)/i,
    /Organization\s*Name\s*[:：]\s*([^\n]+)/i,
  ];
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match) {
      details.companyName = match[1].trim();
      break;
    }
  }

  // Extract Member Class
  const classPatterns = [
    /Member\s*Class\s*[:：]\s*([^\n]+)/i,
    /Class\s*[:：]\s*([^\n]+)/i,
  ];
  for (const pattern of classPatterns) {
    const match = text.match(pattern);
    if (match) {
      details.memberClass = match[1].trim();
      break;
    }
  }

  // Extract Address
  const addressPatterns = [
    /Address\s*[:：]\s*([^\n]+)/i,
    /Location\s*[:：]\s*([^\n]+)/i,
  ];
  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match) {
      details.address = match[1].trim();
      break;
    }
  }

  // Extract Phone
  const phonePatterns = [
    /Phone\s*[:：]\s*([^\n]+)/i,
    /Contact\s*[:：]\s*([^\n]+)/i,
    /Tel\s*[:：]\s*([^\n]+)/i,
  ];
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      details.phone = match[1].trim();
      break;
    }
  }

  // Extract Email
  const emailMatch = text.match(/Email\s*[:：]\s*([^\n]+)/i);
  if (emailMatch) {
    details.email = emailMatch[1].trim();
  }

  return details;
};

// Verify PDF and extract Member ID
export const verifyChamberCertificate = async (pdfPath) => {
  try {
    console.log(`📄 Verifying chamber certificate: ${pdfPath}`);
    
    // Extract text from PDF
    const text = await extractTextFromPDF(pdfPath);
    
    if (!text || text.trim().length < 10) {
      return {
        success: false,
        message: 'Could not read PDF content. Please ensure the file is not corrupted.',
        memberId: null,
        details: null,
      };
    }

    console.log('📝 Extracted text length:', text.length);
    console.log('📝 Preview:', text.substring(0, 200));

    // Extract Member ID
    const memberId = extractMemberIdFromText(text);
    
    if (memberId) {
      console.log(`✅ Member ID found: ${memberId}`);
      
      // Extract additional details
      const details = extractMemberDetailsFromText(text);
      details.memberId = memberId;
      
      return {
        success: true,
        message: 'Member ID extracted successfully',
        memberId: memberId,
        details: details,
        fullText: text,
      };
    } else {
      console.log('❌ No Member ID found in PDF');
      return {
        success: false,
        message: 'No Chamber Member ID found in the certificate.',
        memberId: null,
        details: null,
      };
    }
  } catch (error) {
    console.error('❌ Error verifying chamber certificate:', error);
    return {
      success: false,
      message: 'Error reading PDF: ' + error.message,
      memberId: null,
      details: null,
    };
  }
};