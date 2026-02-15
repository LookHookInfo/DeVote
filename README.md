# De Vote

De Vote is a decentralized project management platform built on Web3 principles. It enables communities to create and vote on proposals, manage projects transparently, and reward participation through blockchain technology.

## Features

*   **Decentralized Proposals & Voting**: Create and vote on project proposals in a transparent and immutable manner.
*   **NFT-Gated Participation**: Control voting eligibility by requiring users to hold specific NFTs (e.g., OG or Farm NFTs) to create proposals or vote.
*   **Creator Name Registration**: Register and display human-readable names for proposal creators, enhancing community recognition and simplifying identity.
*   **Intuitive Progress Timers**: Visual progress bars for proposals' end times, with exact date and time details available on hover.
*   **Reward Claiming**: Voters who participate in successful proposals can claim rewards (e.g., HASH tokens).

## Tech Stack

*   **Framework**: React
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Web3 Integration**: Thirdweb

---

## Project Setup Instructions

To get this project up and running on a new machine, follow these steps:

### Prerequisites

Make sure you have Node.js and a package manager installed. This project uses `bun` for package management, but `npm` can also be used.

*   **Node.js**: [Download and install Node.js](https://nodejs.org/en/download/) (which includes npm).
*   **Bun (Recommended)**: [Install Bun](https://bun.sh/docs/installation).
    *   Alternatively, you can use `npm` which comes with Node.js.

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <repository-url>
cd <your-project-directory>
```
*(Replace `<repository-url>` with the actual URL of your Git repository and `<your-project-directory>` with the name of the cloned directory)*

### 2. Install Dependencies

Navigate into the project directory and install the required dependencies.

**Using Bun (Recommended):**

```bash
bun install
```

**Using npm (Alternative):**

```bash
npm install
```

### 3. Run the Development Server

Once the dependencies are installed, you can start the development server:

**Using Bun:**

```bash
bun run dev
```

**Using npm:**

```bash
npm run dev
```

This will typically start the application on `http://localhost:5173`.

### 4. Build for Production

To create a production-ready build of the application:

**Using Bun:**

```bash
bun run build
```

**Using npm:**

```bash
npm run build
```

This command will compile and optimize your application for deployment, placing the output files in the `dist` directory.