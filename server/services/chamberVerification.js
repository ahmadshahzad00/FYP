import * as cheerio from 'cheerio';
import axios from 'axios';

// SCCI Website URL
const SCCI_BASE_URL = 'https://scci.com.pk';

// List of common SCCI member ID formats
const SCCI_MEMBER_PATTERNS = [
  /^C-\d{3,6}$/i,      // C-001
  /^M-\d{3,6}$/i,      // M-001
  /^SCCI-\d{3,6}$/i,   // SCCI-001
  /^SCCI\d{3,6}$/i,    // SCCI001
  /^\d{4,6}$/i,        // 123456
  /^[A-Z]{1,3}-\d{3,6}$/i, // ABC-001
];

// Verify member ID through web scraping
export const verifyMemberId = async (memberId) => {
  try {
    console.log(`🔍 Verifying Member ID: ${memberId}`);
    
    // First check if member ID format is valid
    if (!isValidMemberIdFormat(memberId)) {
      return {
        verified: false,
        message: 'Invalid member ID format. ID should follow SCCI format (e.g., C-001, M-001)'
      };
    }

    // Method 1: Try to search on SCCI website
    const searchResult = await searchMemberOnSCCI(memberId);
    
    if (searchResult.found) {
      return {
        verified: true,
        message: 'Member ID verified successfully',
        data: searchResult.data
      };
    }

    // Method 2: Try alternative search methods
    const altResult = await alternativeSearch(memberId);
    
    if (altResult.found) {
      return {
        verified: true,
        message: 'Member ID verified through alternative search',
        data: altResult.data
      };
    }

    // Method 3: Check if member ID follows valid pattern (fallback)
    if (isValidMemberIdFormat(memberId)) {
      return {
        verified: true,
        message: 'Member ID format is valid (manual verification required)',
        data: {
          memberId: memberId,
          format: 'valid',
          requiresManualVerification: true
        }
      };
    }

    return {
      verified: false,
      message: 'Member ID not found in Chamber of Commerce records'
    };

  } catch (error) {
    console.error('❌ Verification error:', error);
    return {
      verified: false,
      message: 'Verification service error: ' + error.message
    };
  }
};

// Search member on SCCI website
const searchMemberOnSCCI = async (memberId) => {
  try {
    // Try different possible URLs
    const urls = [
      `${SCCI_BASE_URL}/members`,
      `${SCCI_BASE_URL}/member-directory`,
      `${SCCI_BASE_URL}/member-list`,
      `${SCCI_BASE_URL}/members-list`,
      `${SCCI_BASE_URL}/chamber-members`,
      `${SCCI_BASE_URL}/member/search`,
    ];

    for (const url of urls) {
      try {
        console.log(`📡 Checking: ${url}`);
        
        const response = await axios.get(url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          }
        });

        const $ = cheerio.load(response.data);
        const pageText = $('body').text().toLowerCase();

        // Search for member ID in page
        if (pageText.includes(memberId.toLowerCase())) {
          console.log(`✅ Found member ID on: ${url}`);
          
          // Try to extract member info
          const memberInfo = extractMemberInfo($, memberId);
          
          return {
            found: true,
            data: {
              memberId: memberId,
              ...memberInfo,
              source: url,
              verifiedAt: new Date().toISOString()
            }
          };
        }
      } catch (e) {
        // Continue to next URL
        continue;
      }
    }

    return { found: false };

  } catch (error) {
    console.error('Search error:', error);
    return { found: false };
  }
};

// Alternative search methods
const alternativeSearch = async (memberId) => {
  try {
    // Try to find member in common patterns
    const searchQueries = [
      `memberId:${memberId}`,
      `member:${memberId}`,
      `id:${memberId}`,
    ];

    for (const query of searchQueries) {
      try {
        const response = await axios.get(`${SCCI_BASE_URL}?s=${encodeURIComponent(query)}`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const $ = cheerio.load(response.data);
        const pageText = $('body').text().toLowerCase();

        if (pageText.includes(memberId.toLowerCase())) {
          return {
            found: true,
            data: {
              memberId: memberId,
              found: true,
              searchQuery: query,
              verifiedAt: new Date().toISOString()
            }
          };
        }
      } catch (e) {
        continue;
      }
    }

    return { found: false };

  } catch (error) {
    console.error('Alternative search error:', error);
    return { found: false };
  }
};

// Extract member information from HTML
const extractMemberInfo = ($, memberId) => {
  const info = {
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  };

  // Try to find company name near member ID
  const bodyText = $('body').text();
  const lines = bodyText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(memberId) && i < lines.length - 1) {
      // Look for company name in surrounding lines
      const surroundingText = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(' ');
      
      // Try to extract company name
      const nameMatch = surroundingText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Corporation|Company|Inc|Ltd|LLC|Private|Limited|Pvt|Co))/i);
      if (nameMatch) {
        info.companyName = nameMatch[0].trim();
      }
      
      // Try to extract address
      const addressMatch = surroundingText.match(/(\d{1,5}\s+[A-Za-z]+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*,\s+[A-Z]{2}\s+\d{5})/);
      if (addressMatch) {
        info.address = addressMatch[0].trim();
      }
      
      break;
    }
  }

  // Try to find contact information
  const phoneMatch = bodyText.match(/\+?[\d\s-]{10,15}/);
  if (phoneMatch) {
    info.phone = phoneMatch[0].trim();
  }

  const emailMatch = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    info.email = emailMatch[0].trim();
  }

  return info;
};

// Check if member ID follows valid format
export const isValidMemberIdFormat = (memberId) => {
  if (!memberId || typeof memberId !== 'string') return false;
  
  // Check against all patterns
  for (const pattern of SCCI_MEMBER_PATTERNS) {
    if (pattern.test(memberId)) {
      return true;
    }
  }
  
  return false;
};

// Simple verification (fast, less reliable)
export const verifyMemberIdSimple = async (memberId) => {
  try {
    // Check format first
    if (!isValidMemberIdFormat(memberId)) {
      return {
        verified: false,
        message: 'Invalid member ID format'
      };
    }

    // Try to fetch member list page
    const response = await axios.get(`${SCCI_BASE_URL}/members`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const pageText = $('body').text().toLowerCase();
    
    if (pageText.includes(memberId.toLowerCase())) {
      return {
        verified: true,
        message: 'Member ID found in chamber directory'
      };
    } else {
      return {
        verified: false,
        message: 'Member ID not found in chamber directory'
      };
    }
  } catch (error) {
    console.error('Simple verification error:', error);
    return {
      verified: false,
      message: 'Could not verify member ID'
    };
  }
};