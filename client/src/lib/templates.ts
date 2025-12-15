import type { Template } from "@shared/schema";

export const animationTemplates: Template[] = [
  {
    id: "pythagorean",
    name: "Pythagorean Theorem",
    description: "Visualize the famous a² + b² = c² theorem with animated squares",
    category: "mathematics",
    promptTemplate: "Create an educational animation explaining the Pythagorean theorem. Show a right triangle with sides a, b, and c. Animate squares on each side to demonstrate that the area of the square on the hypotenuse equals the sum of the areas of the other two squares.",
    difficulty: "beginner",
  },
  {
    id: "derivative",
    name: "Derivative Visualization",
    description: "Animate the concept of derivatives as slope of tangent lines",
    category: "mathematics",
    promptTemplate: "Create an animation showing how derivatives work. Start with a curve f(x) = x². Show a secant line between two points, then animate the second point approaching the first to show the tangent line. Display the derivative formula and explain the limit concept.",
    difficulty: "intermediate",
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort Algorithm",
    description: "Step-by-step visualization of the bubble sort algorithm",
    category: "computer_science",
    promptTemplate: "Create an animation demonstrating the bubble sort algorithm. Show an array of colored bars of different heights. Animate the comparison and swapping process, highlighting which elements are being compared. Show the sorted portion growing from the end.",
    difficulty: "beginner",
  },
  {
    id: "pendulum",
    name: "Simple Pendulum Motion",
    description: "Demonstrate harmonic motion with a swinging pendulum",
    category: "physics",
    promptTemplate: "Create an animation of a simple pendulum demonstrating harmonic motion. Show the pendulum swinging back and forth. Display the equations of motion, angle theta over time, and energy conservation. Add velocity and acceleration vectors.",
    difficulty: "intermediate",
  },
  {
    id: "atom-structure",
    name: "Atomic Structure",
    description: "Visualize electron orbitals and atomic structure",
    category: "chemistry",
    promptTemplate: "Create an animation showing the structure of an atom. Start with the nucleus containing protons and neutrons, then add electron shells. Show electrons orbiting and explain energy levels. Transition to show electron cloud probability distributions.",
    difficulty: "intermediate",
  },
  {
    id: "binary-tree",
    name: "Binary Search Tree",
    description: "Animate insertion and search in a binary search tree",
    category: "computer_science",
    promptTemplate: "Create an animation showing binary search tree operations. Start with an empty tree, then animate the insertion of nodes [50, 30, 70, 20, 40, 60, 80]. Highlight the comparison path for each insertion. Then demonstrate searching for a value.",
    difficulty: "advanced",
  },
  {
    id: "cell-division",
    name: "Cell Division (Mitosis)",
    description: "Visualize the stages of mitotic cell division",
    category: "biology",
    promptTemplate: "Create an animation showing the stages of mitosis. Begin with interphase showing DNA replication, then animate prophase, metaphase, anaphase, and telophase. Show chromosomes condensing, aligning, separating, and the cell dividing into two daughter cells.",
    difficulty: "advanced",
  },
  {
    id: "quadratic-formula",
    name: "Quadratic Formula Derivation",
    description: "Step-by-step derivation of the quadratic formula",
    category: "mathematics",
    promptTemplate: "Create an animation deriving the quadratic formula from ax² + bx + c = 0. Show each algebraic step: dividing by a, completing the square, and solving for x. Highlight transformations and simplifications with smooth transitions.",
    difficulty: "beginner",
  },
];

export function getTemplatesByCategory(category: Template["category"]): Template[] {
  return animationTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return animationTemplates.find((t) => t.id === id);
}
