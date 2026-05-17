export const getRequiredScoreForTier = (tier) => {
    switch (tier) {
      case 1: return 750; // Standard ECE Textbooks
      case 2: return 800; // Specialized Lab Manuals
      case 3: return 900; // Advanced VLSI/Research Papers
      default: return 0;   // Basic Reference
    }
};