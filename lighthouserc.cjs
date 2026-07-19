module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run preview",
      startServerReadyPattern: "Accepting connections",
      url: ["http://127.0.0.1:4173/"],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:performance": ["warn", { minScore: 0.85 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
