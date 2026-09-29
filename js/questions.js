/**
 * QuizNest - Comprehensive Question Bank
 * Contains structured questions for Easy, Medium, and Hard difficulty levels,
 * categorized across Web Development, Computer Science, and General Tech Aptitude.
 * Each question has: id, category, difficulty, question, options, answer, explanation.
 */

const QUESTION_BANK = {
  // ==========================================
  // EASY LEVEL (Beginner-Friendly Fundamentals)
  // ==========================================
  easy: [
    // Web Development
    {
      id: "ez_web_1",
      category: "web_development",
      difficulty: "easy",
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<nav>"],
      answer: "<a>",
      explanation: "The <a> (anchor) tag in HTML is used to define hyperlinks which navigate from one page to another."
    },
    {
      id: "ez_web_2",
      category: "web_development",
      difficulty: "easy",
      question: "Which CSS property is used to change the background color of an element?",
      options: ["color", "bgcolor", "background-color", "canvas-color"],
      answer: "background-color",
      explanation: "The 'background-color' CSS property sets the background color of an HTML element."
    },
    {
      id: "ez_web_3",
      category: "web_development",
      difficulty: "easy",
      question: "Which JavaScript keyword is used to declare a variable that cannot be reassigned?",
      options: ["var", "let", "const", "fixed"],
      answer: "const",
      explanation: "Variables declared with 'const' cannot be reassigned after their initial declaration."
    },
    {
      id: "ez_web_4",
      category: "web_development",
      difficulty: "easy",
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Machine Language",
        "Hyper Transfer Markdown Language",
        "Home Tool Markup Logic"
      ],
      answer: "Hyper Text Markup Language",
      explanation: "HTML stands for Hyper Text Markup Language, the standard markup for documents designed to be displayed in a web browser."
    },
    {
      id: "ez_web_5",
      category: "web_development",
      difficulty: "easy",
      question: "How do you select an element with id 'header' in CSS?",
      options: [".header", "#header", "*header", "header::id"],
      answer: "#header",
      explanation: "In CSS, the hash symbol (#) is used to select elements by their ID attribute."
    },
    {
      id: "ez_web_6",
      category: "web_development",
      difficulty: "easy",
      question: "Which function outputs a message to the browser console in JavaScript?",
      options: ["console.print()", "console.log()", "print()", "terminal.write()"],
      answer: "console.log()",
      explanation: "console.log() writes informational messages to the browser's debugging console."
    },

    // Computer Science & Programming
    {
      id: "ez_cs_1",
      category: "computer_science",
      difficulty: "easy",
      question: "Which data structure follows the LIFO (Last In First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      answer: "Stack",
      explanation: "A Stack works on the LIFO principle, meaning the last element added is the first one removed (push and pop operations)."
    },
    {
      id: "ez_cs_2",
      category: "computer_science",
      difficulty: "easy",
      question: "What is the index of the first element in standard JavaScript and C arrays?",
      options: ["1", "-1", "0", "None"],
      answer: "0",
      explanation: "Most programming languages use zero-based indexing, where the first element is located at index 0."
    },
    {
      id: "ez_cs_3",
      category: "computer_science",
      difficulty: "easy",
      question: "What does CPU stand for in computer hardware?",
      options: [
        "Central Processing Unit",
        "Control Program Utility",
        "Computer Power Unit",
        "Core Processing Utility"
      ],
      answer: "Central Processing Unit",
      explanation: "CPU stands for Central Processing Unit, often called the brain of a computer."
    },
    {
      id: "ez_cs_4",
      category: "computer_science",
      difficulty: "easy",
      question: "Which symbol is used for single-line comments in JavaScript, C++, and Java?",
      options: ["#", "<!-- -->", "//", "/* */"],
      answer: "//",
      explanation: "Two forward slashes '//' denote single-line comments in C, C++, Java, and JavaScript."
    },
    {
      id: "ez_cs_5",
      category: "computer_science",
      difficulty: "easy",
      question: "Which of the following is an example of an Operating System?",
      options: ["Google Chrome", "Linux", "Microsoft Word", "Python"],
      answer: "Linux",
      explanation: "Linux is an open-source operating system kernel that manages computer hardware and system resources."
    },

    // General Knowledge & Tech Aptitude
    {
      id: "ez_gk_1",
      category: "general_tech",
      difficulty: "easy",
      question: "What is the capital city of India?",
      options: ["Mumbai", "New Delhi", "Bengaluru", "Kolkata"],
      answer: "New Delhi",
      explanation: "New Delhi is the official capital city of India and the seat of government."
    },
    {
      id: "ez_gk_2",
      category: "general_tech",
      difficulty: "easy",
      question: "Which company created the Android operating system before Google acquired it?",
      options: ["Android Inc.", "Apple", "Nokia", "Motorola"],
      answer: "Android Inc.",
      explanation: "Android Inc. was founded in Palo Alto, California in 2003 by Andy Rubin, Rich Miner, Nick Sears, and Chris White before being acquired by Google in 2005."
    },
    {
      id: "ez_gk_3",
      category: "general_tech",
      difficulty: "easy",
      question: "What does 'RAM' stand for in computer memory?",
      options: [
        "Random Access Memory",
        "Read And Modify",
        "Rapid Action Memory",
        "Run Access Module"
      ],
      answer: "Random Access Memory",
      explanation: "RAM stands for Random Access Memory, a volatile high-speed memory used to store data currently in use."
    },
    {
      id: "ez_gk_4",
      category: "general_tech",
      difficulty: "easy",
      question: "Who is widely recognized as the father of modern computing?",
      options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"],
      answer: "Charles Babbage",
      explanation: "Charles Babbage originated the concept of a digital programmable computer with his Analytical Engine."
    },
    {
      id: "ez_gk_5",
      category: "general_tech",
      difficulty: "easy",
      question: "How many bits are in one standard byte?",
      options: ["4", "8", "16", "32"],
      answer: "8",
      explanation: "A standard byte consists of 8 bits."
    }
  ],

  // ==========================================
  // MEDIUM LEVEL (Intermediate Understanding)
  // ==========================================
  medium: [
    // Web Development
    {
      id: "med_web_1",
      category: "web_development",
      difficulty: "medium",
      question: "What is the output of `typeof null` in standard JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      answer: "'object'",
      explanation: "In JavaScript, 'typeof null' returns 'object' due to a legacy design quirk in the original JavaScript implementation."
    },
    {
      id: "med_web_2",
      category: "web_development",
      difficulty: "medium",
      question: "Which CSS display property turns a container into a flexible flexbox layout?",
      options: ["display: flex", "display: grid", "display: box", "display: inline-block"],
      answer: "display: flex",
      explanation: "Setting 'display: flex' on an element turns it into a flex container and all its direct children into flex items."
    },
    {
      id: "med_web_3",
      category: "web_development",
      difficulty: "medium",
      question: "What does the `event.preventDefault()` method do in JavaScript?",
      options: [
        "Stops event bubbling to parent elements",
        "Prevents the default browser action for the event",
        "Removes the event listener immediately",
        "Resets the form values to default"
      ],
      answer: "Prevents the default browser action for the event",
      explanation: "preventDefault() cancels the event if it is cancelable, meaning the default action that belongs to the event will not occur (like submitting a form or following a link)."
    },
    {
      id: "med_web_4",
      category: "web_development",
      difficulty: "medium",
      question: "What is the difference between `==` and `===` operators in JavaScript?",
      options: [
        "`==` checks value only with type coercion, while `===` checks both value and type",
        "`===` checks value only, while `==` checks both",
        "There is no difference between them",
        "`==` is used for strings and `===` is used for numbers"
      ],
      answer: "`==` checks value only with type coercion, while `===` checks both value and type",
      explanation: "The loose equality operator (==) performs type coercion before comparison, whereas the strict equality operator (===) checks both value and data type without conversion."
    },
    {
      id: "med_web_5",
      category: "web_development",
      difficulty: "medium",
      question: "Which HTML5 attribute allows input fields to validate that user input cannot be left empty?",
      options: ["validate='true'", "required", "mandatory", "nonempty"],
      answer: "required",
      explanation: "The 'required' boolean attribute specifies that an input field must be filled out before submitting the form."
    },
    {
      id: "med_web_6",
      category: "web_development",
      difficulty: "medium",
      question: "Which Web API is used in modern browsers to store key-value data with no expiration time?",
      options: ["sessionStorage", "localStorage", "IndexedDB", "document.cookie"],
      answer: "localStorage",
      explanation: "localStorage stores data with no expiration date. The data remains stored even when the browser is closed and reopened."
    },

    // Computer Science & Programming
    {
      id: "med_cs_1",
      category: "computer_science",
      difficulty: "medium",
      question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: "O(log n)",
      explanation: "In a balanced BST, each comparison cuts the search space approximately in half, resulting in an O(log n) time complexity."
    },
    {
      id: "med_cs_2",
      category: "computer_science",
      difficulty: "medium",
      question: "Which of the following is NOT an Object-Oriented Programming (OOP) pillar?",
      options: ["Encapsulation", "Compilation", "Polymorphism", "Inheritance"],
      answer: "Compilation",
      explanation: "The four main pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is a translation step."
    },
    {
      id: "med_cs_3",
      category: "computer_science",
      difficulty: "medium",
      question: "In Python, which built-in data type is immutable?",
      options: ["list", "dict", "tuple", "set"],
      answer: "tuple",
      explanation: "Tuples in Python cannot be modified (elements cannot be added, removed, or changed) once created, making them immutable."
    },
    {
      id: "med_cs_4",
      category: "computer_science",
      difficulty: "medium",
      question: "Which sorting algorithm has a worst-case time complexity of O(n^2) but best-case of O(n)?",
      options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
      answer: "Bubble Sort",
      explanation: "With an optimized flag to detect if swaps occurred, Bubble Sort has a best-case time complexity of O(n) when the array is already sorted, and O(n^2) in the worst case."
    },
    {
      id: "med_cs_5",
      category: "computer_science",
      difficulty: "medium",
      question: "In Networking, which OSI layer is responsible for routing packets between networks?",
      options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
      answer: "Network Layer",
      explanation: "The Network Layer (Layer 3 of OSI) handles packet forwarding, addressing (such as IP addresses), and routing through intermediate routers."
    },

    // General Tech & Aptitude
    {
      id: "med_gk_1",
      category: "general_tech",
      difficulty: "medium",
      question: "What does the 'S' stand for in HTTPS?",
      options: ["Standard", "Secure", "Socket", "Speed"],
      answer: "Secure",
      explanation: "HTTPS stands for HyperText Transfer Protocol Secure. It encrypts communication using TLS/SSL."
    },
    {
      id: "med_gk_2",
      category: "general_tech",
      difficulty: "medium",
      question: "Which open-source version control system was created by Linus Torvalds in 2005?",
      options: ["SVN", "Git", "Mercurial", "CVS"],
      answer: "Git",
      explanation: "Linus Torvalds created Git in 2005 to manage development of the Linux kernel."
    },
    {
      id: "med_gk_3",
      category: "general_tech",
      difficulty: "medium",
      question: "What is the primary function of a DNS (Domain Name System) server?",
      options: [
        "Translate human-readable domain names into IP addresses",
        "Encrypt web traffic over WiFi",
        "Store website HTML and CSS files",
        "Block computer viruses and malware"
      ],
      answer: "Translate human-readable domain names into IP addresses",
      explanation: "DNS acts as the phonebook of the Internet, translating domain names like 'example.com' into computer-friendly IP addresses."
    },
    {
      id: "med_gk_4",
      category: "general_tech",
      difficulty: "medium",
      question: "Which HTTP status code signifies 'Resource Not Found'?",
      options: ["200", "401", "404", "500"],
      answer: "404",
      explanation: "HTTP 404 Not Found indicates that the origin server did not find a current representation for the target resource."
    },
    {
      id: "med_gk_5",
      category: "general_tech",
      difficulty: "medium",
      question: "Which port number is used by default for unencrypted HTTP traffic?",
      options: ["21", "80", "443", "8080"],
      answer: "80",
      explanation: "Port 80 is the default port assigned to unencrypted HTTP web traffic, while 443 is used for secure HTTPS."
    }
  ],

  // ==========================================
  // HARD LEVEL (Advanced & In-Depth Concepts)
  // ==========================================
  hard: [
    // Web Development
    {
      id: "hrd_web_1",
      category: "web_development",
      difficulty: "hard",
      question: "In JavaScript, what is a closure?",
      options: [
        "A function bundled with references to its surrounding lexical environment",
        "A function that automatically terminates after one execution",
        "A method to close browser tabs programmatically",
        "A syntax error caused by unclosed curly braces"
      ],
      answer: "A function bundled with references to its surrounding lexical environment",
      explanation: "A closure gives a function access to its outer scope from an inner function, preserving variables even after the outer function has executed."
    },
    {
      id: "hrd_web_2",
      category: "web_development",
      difficulty: "hard",
      question: "What is the event execution order in the JavaScript Event Loop?",
      options: [
        "Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout)",
        "Call Stack -> Macrotask Queue -> Microtask Queue",
        "Macrotask Queue -> Call Stack -> Microtask Queue",
        "Microtask Queue -> Macrotask Queue -> Call Stack"
      ],
      answer: "Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout)",
      explanation: "When the Call Stack empties, the Event Loop processes all microtasks (Promise reactions, queueMicrotask) before picking the next macrotask (setTimeout, setInterval, I/O)."
    },
    {
      id: "hrd_web_3",
      category: "web_development",
      difficulty: "hard",
      question: "What will `[1, 2, 3] + [4, 5, 6]` evaluate to in JavaScript?",
      options: ["[1, 2, 3, 4, 5, 6]", "'1,2,34,5,6'", "NaN", "TypeError"],
      answer: "'1,2,34,5,6'",
      explanation: "The addition operator converts both arrays to primitive strings ('1,2,3' and '4,5,6') and concatenates them, resulting in '1,2,34,5,6'."
    },
    {
      id: "hrd_web_4",
      category: "web_development",
      difficulty: "hard",
      question: "Which CSS property triggers hardware GPU acceleration without altering layout reflow?",
      options: ["transform: translateZ(0)", "display: block", "float: left", "margin: auto"],
      answer: "transform: translateZ(0)",
      explanation: "Using 3D CSS transforms like translateZ(0) or will-change informs the browser to promote the element to a composite GPU layer, avoiding costly CPU reflows and repaints."
    },
    {
      id: "hrd_web_5",
      category: "web_development",
      difficulty: "hard",
      question: "What happens when you pass a negative index to JavaScript `Array.prototype.slice(-2)`?",
      options: [
        "Returns the last 2 elements of the array",
        "Throws an IndexOutOfBoundsException",
        "Returns an empty array",
        "Deletes 2 elements from the end"
      ],
      answer: "Returns the last 2 elements of the array",
      explanation: "Negative indices in slice() count backwards from the end of the array. slice(-2) selects from (array.length - 2) to the end."
    },
    {
      id: "hrd_web_6",
      category: "web_development",
      difficulty: "hard",
      question: "What does the 'debounce' function pattern accomplish in modern web development?",
      options: [
        "Limits the execution of a function until a specified delay has passed since its last invocation",
        "Executes a function immediately on every keypress without delay",
        "Forces asynchronous code to run synchronously",
        "Cleans up memory leaks automatically in the DOM"
      ],
      answer: "Limits the execution of a function until a specified delay has passed since its last invocation",
      explanation: "Debouncing ensures that costly functions (like search auto-complete or resize handlers) do not fire until a user has paused typing or scrolling for a set duration."
    },

    // Computer Science & Programming
    {
      id: "hrd_cs_1",
      category: "computer_science",
      difficulty: "hard",
      question: "What is the worst-case time complexity of QuickSort?",
      options: ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"],
      answer: "O(n^2)",
      explanation: "QuickSort exhibits O(n^2) worst-case time complexity when the chosen pivot is consistently the smallest or largest element (such as in an already sorted array without randomized pivots)."
    },
    {
      id: "hrd_cs_2",
      category: "computer_science",
      difficulty: "hard",
      question: "Which concurrency problem occurs when two or more processes are unable to proceed because each is waiting for the other to release a resource?",
      options: ["Starvation", "Deadlock", "Race Condition", "Thrashing"],
      answer: "Deadlock",
      explanation: "Deadlock occurs when processes hold resources while waiting for other resources acquired by other processes, forming a circular wait condition."
    },
    {
      id: "hrd_cs_3",
      category: "computer_science",
      difficulty: "hard",
      question: "In relational database systems, which ACID property guarantees that all database transactions will be recorded permanently even after system failure?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: "Durability",
      explanation: "Durability ensures that once a transaction has been committed, it remains committed and safe even in the event of a power loss or crash."
    },
    {
      id: "hrd_cs_4",
      category: "computer_science",
      difficulty: "hard",
      question: "What algorithm is used to find the shortest path between nodes in a weighted graph with non-negative edge weights?",
      options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Depth-First Search", "KMP Algorithm"],
      answer: "Dijkstra's Algorithm",
      explanation: "Dijkstra's algorithm computes the shortest paths from a single source vertex to all other vertices in a weighted graph with non-negative weights."
    },
    {
      id: "hrd_cs_5",
      category: "computer_science",
      difficulty: "hard",
      question: "In virtual memory management, what is 'Thrashing'?",
      options: [
        "A situation where the CPU spends more time swapping pages in/out than executing processes",
        "A cyber attack that overwhelms system buffers",
        "An algorithm that deletes temporary cache files",
        "A method to parallelize CPU threads"
      ],
      answer: "A situation where the CPU spends more time swapping pages in/out than executing processes",
      explanation: "Thrashing occurs when high page fault frequency causes the operating system to spend excessive time swapping pages between RAM and disk, degrading system performance."
    },

    // General Tech & Architecture
    {
      id: "hrd_gk_1",
      category: "general_tech",
      difficulty: "hard",
      question: "In public-key cryptography (such as RSA), which key is used to sign digital signatures?",
      options: ["Sender's Private Key", "Sender's Public Key", "Receiver's Public Key", "Shared Symmetric Key"],
      answer: "Sender's Private Key",
      explanation: "A digital signature is generated using the sender's private key, ensuring authenticity and non-repudiation because only the sender has access to their private key."
    },
    {
      id: "hrd_gk_2",
      category: "general_tech",
      difficulty: "hard",
      question: "What does the CAP theorem state regarding distributed systems?",
      options: [
        "A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance",
        "Computers always process Code, Audio, and Pictures equally",
        "Capacity, Accuracy, and Performance cannot all be monitored simultaneously",
        "Cloud Architectures must scale Computation, Algorithms, and Protocols"
      ],
      answer: "A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance",
      explanation: "Eric Brewer's CAP theorem proves that in any asynchronous network subject to partitions (P), a distributed data store can only guarantee either Consistency (C) or Availability (A), but not both simultaneously."
    },
    {
      id: "hrd_gk_3",
      category: "general_tech",
      difficulty: "hard",
      question: "Which data structure is most commonly utilized in database indexing for fast range queries and disk block efficiency?",
      options: ["B+ Tree", "Hash Table", "Binary Search Tree", "Linked List"],
      answer: "B+ Tree",
      explanation: "B+ Trees keep data sorted, have high branching factors suitable for disk block page retrieval, and link all leaves together for fast sequential range scans."
    },
    {
      id: "hrd_gk_4",
      category: "general_tech",
      difficulty: "hard",
      question: "What is the primary role of a Reverse Proxy (such as Nginx)?",
      options: [
        "Intercept client requests and distribute them to backend servers, handling load balancing and SSL termination",
        "Translate machine code into human-readable assembly language",
        "Scan local hard drives for malware",
        "Store cookies on the client browser"
      ],
      answer: "Intercept client requests and distribute them to backend servers, handling load balancing and SSL termination",
      explanation: "A reverse proxy sits in front of web servers, forwarding client requests, balancing traffic loads, caching static assets, and providing security/SSL offloading."
    },
    {
      id: "hrd_gk_5",
      category: "general_tech",
      difficulty: "hard",
      question: "What does the acronym 'SOLID' in software design principles stand for?",
      options: [
        "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
        "Synchronous, Object-oriented, Linear, Iterative, Dynamic",
        "Stateful, Operational, Layered, Integrated, Deterministic",
        "Security, Optimization, Logging, Indexing, Deployment"
      ],
      answer: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion",
      explanation: "SOLID stands for the five design principles introduced by Robert C. Martin (Uncle Bob) to make object-oriented software understandable, flexible, and maintainable."
    }
  ]
};

// Helper: Get questions filtered by difficulty and optional category
function getQuestions(difficulty, category = 'all') {
  let pool = QUESTION_BANK[difficulty] || [];
  
  // Merge any custom questions stored in localStorage
  try {
    const customList = JSON.parse(localStorage.getItem('quiznest_custom_questions') || '[]');
    const matchingCustom = customList.filter(q => q.difficulty === difficulty);
    pool = [...pool, ...matchingCustom];
  } catch (e) {
    console.warn('Error reading custom questions from localStorage', e);
  }

  if (category && category !== 'all') {
    const filtered = pool.filter(q => q.category === category);
    if (filtered.length >= 5) {
      return filtered;
    }
    // If not enough questions in specific category, fall back to whole difficulty pool
  }
  return pool;
}
