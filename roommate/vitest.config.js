import { defineConfig } from "vitest/config";

export default defineConfig({

    test: {

        environment: "jsdom",

        globals: true,

        setupFiles: [
            "./tests/setup.js"
        ],

        include: [

            "tests/unit/**/*.test.js",

            "tests/business/**/*.test.js"

        ],

        clearMocks: true,

        restoreMocks: true,

        mockReset: true,

        coverage: {

            provider: "v8",

            reporter: [

                "text",

                "html",

                "lcov"

            ],

            reportsDirectory: "./coverage",

            include: [

                "src/business/**/*.js",

                "src/services/**/*.js"

            ],

            exclude: [

                "node_modules/**",

                "dist/**",

                "coverage/**",

                "tests/**",

                "src/pages/**",

                "src/components/**",

                "src/styles/**",

                "**/*.config.js"

            ]

        }

    }

});