# Manual Hair Loss Quiz

A Next.js 15 application featuring a responsive landing page with an interactive hair loss quiz to help users find the right treatment solution.

## Features

- **Interactive Quiz**: Multi-step questionnaire to guide users to personalized hair loss solutions
- **State Persistence**: Quiz progress is saved, allowing users to continue where they left off
- **Responsive Design**: Fully responsive layout based on manual.co styling
- **Accessibility Focus**: Designed with accessibility in mind
- **Robust Error Handling**: Graceful handling of edge cases and errors

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme
- **Testing**: Jest for unit/integration tests
- **Type Safety**: TypeScript for enhanced developer experience
- **State Management**: React Context API with reducers

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/manual-exercise.git
cd manual-exercise
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test-file
```

## Project Structure

```
├── app/                  # Next.js app router pages
├── components/           # Reusable UI components
│   ├── pages/            # Page-specific components
│   ├── quiz/             # Quiz-related components
│   ├── sections/         # Page section components
│   └── ui/               # Basic UI components
├── contexts/             # React context providers
├── data/                 # Static data files
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and services
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Architecture

This application is built using a component-based architecture with Next.js 15. Here's an overview of how it works:

- **Context API**: The QuizContext manages the quiz state, providing actions like opening/closing the quiz, advancing through questions, and tracking answers.
- **Local Storage**: Quiz state is persisted using localStorage for a seamless user experience across sessions.
- **Validation**: Robust validation ensures data integrity, especially when loading from localStorage, to prevent edge cases.
- **Component Composition**: UI is built from composable, reusable components, making the codebase maintainable and scalable.

## Enhancements Made

- **Animations**: Added smooth transitions between quiz steps and UI states
- **Progress Bar**: Visual indicator of quiz completion progress
- **Responsive Design**: Fully responsive layout based on manual.co design system
- **Cypress / Integration Tests**: Comprehensive test coverage including integration tests
- **Better mapping for component data**: Modular approach to component data that could be served from a CDN
- **Designed to be modular**: Components designed to be reusable across different landing pages

## Potential Improvements

- **Better validation for local storage**: Enhance validation for edge cases in local storage data
- **Better UI when resetting quiz**: Improved UI flow when resetting the quiz - currently returns to landing page
- **Consider types sizing**: Optimize TypeScript type definitions for better performance
- **Use tailwind classes better**: Better utilize Tailwind classes instead of manual CSS overrides
- **Footer Link section could be dynamic**: Make footer link section fully dynamic
- **Added persisting state to continue the quiz**: Further enhance the state persistence mechanism
- **Can improve the landing page button better**: Improve the landing page button action mapping system
- **Add better aria / accessibility options**: Add more comprehensive aria labels and accessibility features considering the demographic of customers
- **Have better fallbacks for local storage**: Implement more robust fallbacks for environments where localStorage is unavailable

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from [manual.co](https://www.manual.co)
- Next.js team for the amazing framework
- All contributors who have helped improve this codebase
