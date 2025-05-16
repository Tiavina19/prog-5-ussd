# prog-5-ussd

This project implements a USSD-style menu interface in Node.js for managing simple financial operations via the console.

## Features

- **Main Menu**:

  - Enter USSD code (#111#)
  - Navigate to the “Mvola” submenu
  - Option to quit the application

- **Submenus**:

  - Purchase airtime or offers (for own number or another)
  - Transfer money (to a phone number, savings, or advance)
  - Manage savings/credit (deposit, withdrawal, balance check, simulator)
  - Cash withdrawal via Mvola agent or SGM ATM
  - View account balance
  - Display available savings and advance
  - “Back” option to return to the previous menu

- **Security**:

  - PIN validation (3 attempts)
  - Input timeout (20 seconds)

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## ESLint Configuration

1. Initialize ESLint if not already done:

   ```bash
   npx eslint --init
   ```

2. Example `.eslintrc.json`:

   ```json
   {
     "env": {
       "node": true,
       "es2021": true
     },
     "extends": ["airbnb-base"],
     "parserOptions": {
       "ecmaVersion": 12,
       "sourceType": "module"
     },
     "rules": {
       "no-console": "off",
       "consistent-return": "off",
       "no-await-in-loop": "off",
       "no-unused-vars": [
         "warn",
         { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
       ]
     }
   }
   ```

3. Create a `.eslintignore` file:

   ```gitignore
   node_modules/
   dist/
   ```

4. Add scripts in `package.json`:

   ```json
   "scripts": {
     "start": "node ussd.js",
     "lint": "eslint .",
     "lint:fix": "eslint . --fix"
   }
   ```

## Usage

Run the application:

```bash
node ussd.js
```

Follow the on-screen instructions:

- Enter the USSD code `#111#`
- Navigate menus using numbers and `0` to go back
- Default PIN is `0200`

## Code Structure

- **ussd.js**: Full implementation of menus and USSD logic
- **.eslintrc.json**: ESLint configuration file
- **.eslintignore**: Files to ignore during linting

## Naming Conventions

- Use **camelCase** for variable and function names (e.g., `userBalance`, `promptWithTimeout`, `mvolaSubmenu`).
- Use **kebab-case** for filenames (e.g., `ussd.js`, `.eslintrc.json`).
