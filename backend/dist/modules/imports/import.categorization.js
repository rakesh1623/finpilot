const expenseRules = [
    {
        category: "Food",
        keywords: [
            "swiggy", "zomato", "restaurant",
            "dinner", "lunch", "breakfast", "cafe",
        ],
    },
    {
        category: "Transport",
        keywords: [
            "uber", "ola", "rapido", "ixigo",
            "irctc", "flight", "cab", "fuel", "metro",
        ],
    },
    {
        category: "Groceries",
        keywords: [
            "blinkit", "zepto", "bigbasket",
            "grocery", "groceries", "supermarket",
        ],
    },
    {
        category: "Shopping",
        keywords: [
            "amazon", "flipkart", "myntra", "shopping",
        ],
    },
    {
        category: "Rent",
        keywords: ["rent"],
    },
    {
        category: "Entertainment",
        keywords: [
            "netflix", "spotify", "cinema", "movie",
        ],
    },
    {
        category: "Healthcare",
        keywords: [
            "hospital", "pharmacy", "medicine", "doctor",
        ],
    },
    {
        category: "Utilities",
        keywords: [
            "electricity", "internet", "broadband",
            "water bill", "recharge",
        ],
    },
];
const incomeRules = [
    {
        category: "Salary",
        keywords: ["salary", "payroll"],
    },
    {
        category: "Freelance",
        keywords: ["freelance", "client payment"],
    },
    {
        category: "Investments",
        keywords: ["dividend", "interest income"],
    },
];
export function suggestCategory(row, categories) {
    const available = categories.filter((category) => category.type === row.type);
    function findCategory(name) {
        return available.find((category) => category.name.toLowerCase() === name.toLowerCase());
    }
    // Priority 1: Explicit category from uploaded file.
    if (row.category) {
        const category = findCategory(row.category);
        if (category)
            return category;
    }
    // Priority 2: Keyword-based category suggestion.
    const text = `${row.description} ${row.merchant ?? ""}`
        .toLowerCase();
    const rules = row.type === "EXPENSE"
        ? expenseRules
        : incomeRules;
    for (const rule of rules) {
        if (rule.keywords.some((keyword) => text.includes(keyword))) {
            const category = findCategory(rule.category);
            if (category)
                return category;
        }
    }
    // Priority 3: Default fallback category.
    return findCategory(row.type === "EXPENSE"
        ? "Other Expense"
        : "Other Income") ?? null;
}
//# sourceMappingURL=import.categorization.js.map