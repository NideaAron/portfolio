// ================================
// ARON NIDEA PORTFOLIO
// Typing Code Animation
// ================================

document.addEventListener("DOMContentLoaded", function () {

    const codeText = document.getElementById("codeText");

    const codeSnippets = [

        `const developer = {
    name: "Aron Nidea",
    course: "BSIT",
    skills: [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    coding: true
};`,

        `function buildPortfolio() {
    const skills = [
        "Web Development",
        "SQL",
        "PostgreSQL",
        "Python"
    ];

    return skills;
}`,

        `const project = {
    title: "My Portfolio",
    developer: "Aron Nidea",
    status: "Building",
    learning: true
};`,

        `while (learning) {
    practice();
    createProjects();
    solveProblems();
    improveSkills();
}`

    ];


    let snippetIndex = 0;
    let characterIndex = 0;
    let deleting = false;


    function typeCode() {

        const currentCode = codeSnippets[snippetIndex];


        // TYPING
        if (!deleting) {

            codeText.textContent =
                currentCode.substring(
                    0,
                    characterIndex + 1
                );

            characterIndex++;


            // Finished typing
            if (characterIndex === currentCode.length) {

                deleting = true;

                setTimeout(typeCode, 2500);

                return;
            }

            setTimeout(typeCode, 35);

        }


        // DELETING
        else {

            codeText.textContent =
                currentCode.substring(
                    0,
                    characterIndex - 1
                );

            characterIndex--;


            // Finished deleting
            if (characterIndex === 0) {

                deleting = false;

                snippetIndex++;

                if (snippetIndex >= codeSnippets.length) {
                    snippetIndex = 0;
                }

                setTimeout(typeCode, 500);

                return;
            }

            setTimeout(typeCode, 15);
        }

    }


    // START ANIMATION
    typeCode();

});
