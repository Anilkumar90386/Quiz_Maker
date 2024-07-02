document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const createQuizPage = document.getElementById('create-quiz-page');
    const takeQuizPage = document.getElementById('take-quiz-page');
    const quizPage = document.getElementById('quiz-page');
    const feedbackPage = document.getElementById('feedback-page');

    const homeLink = document.getElementById('home-link');
    const createQuizLink = document.getElementById('create-quiz-link');
    const takeQuizLink = document.getElementById('take-quiz-link');

    const quizForm = document.getElementById('quiz-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const quizList = document.getElementById('quiz-list');
    const takeQuizForm = document.getElementById('take-quiz-form');
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const quizQuestions = document.getElementById('quiz-questions');
    const feedbackMessage = document.getElementById('feedback-message');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');

    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    homeLink.addEventListener('click', () => {
        showPage(homePage);
    });

    createQuizLink.addEventListener('click', () => {
        showPage(createQuizPage);
    });

    takeQuizLink.addEventListener('click', () => {
        showPage(takeQuizPage);
        displayQuizzes();
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createQuiz();
    });

    addQuestionBtn.addEventListener('click', () => {
        addQuestionField();
    });

    takeQuizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuiz();
    });

    retakeQuizBtn.addEventListener('click', () => {
        showPage(homePage);
    });

    function showPage(page) {
        homePage.style.display = 'none';
        createQuizPage.style.display = 'none';
        takeQuizPage.style.display = 'none';
        quizPage.style.display = 'none';
        feedbackPage.style.display = 'none';
        page.style.display = 'block';
    }

    function addQuestionField() {
        const questionCount = questionsContainer.childElementCount + 1;
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('form-group');
        questionDiv.innerHTML = `
            <label for="question-${questionCount}">Question ${questionCount}</label>
            <input type="text" id="question-${questionCount}" class="question-text" required>
            <label for="option1-${questionCount}">Option 1</label>
            <input type="text" id="option1-${questionCount}" class="question-option" required>
            <label for="option2-${questionCount}">Option 2</label>
            <input type="text" id="option2-${questionCount}" class="question-option" required>
            <label for="option3-${questionCount}">Option 3</label>
            <input type="text" id="option3-${questionCount}" class="question-option" required>
            <label for="option4-${questionCount}">Option 4</label>
            <input type="text" id="option4-${questionCount}" class="question-option" required>
            <label for="correct-${questionCount}">Correct Option</label>
            <select id="correct-${questionCount}" class="question-correct" required>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
            </select>
        `;
        questionsContainer.appendChild(questionDiv);
    }

    function createQuiz() {
        const title = document.getElementById('quiz-title').value;
        const questions = [];
        const questionDivs = questionsContainer.getElementsByClassName('form-group');

        for (let div of questionDivs) {
            const questionText = div.querySelector('.question-text').value;
            const options = [
                div.querySelector('#option1-' + (questions.length + 1)).value,
                div.querySelector('#option2-' + (questions.length + 1)).value,
                div.querySelector('#option3-' + (questions.length + 1)).value,
                div.querySelector('#option4-' + (questions.length + 1)).value,
            ];
            const correctOption = div.querySelector('.question-correct').value;
            questions.push({ questionText, options, correctOption });
        }

        quizzes.push({ title, questions });
        localStorage.setItem('quizzes', JSON.stringify(quizzes));

        alert('Quiz created successfully!');
        quizForm.reset();
        questionsContainer.innerHTML = '';
    }

    function displayQuizzes() {
        quizList.innerHTML = '';
        quizzes.forEach((quiz, index) => {
            const quizDiv = document.createElement('div');
            quizDiv.classList.add('quiz-item');
            quizDiv.innerHTML = `<button onclick="takeQuiz(${index})">${quiz.title}</button>`;
            quizList.appendChild(quizDiv);
        });
    }

    window.takeQuiz = function(index) {
        const quiz = quizzes[index];
        quizTitleDisplay.textContent = quiz.title;
        quizQuestions.innerHTML = '';

        quiz.questions.forEach((question, i) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('form-group');
            questionDiv.innerHTML = `
                <label>${question.questionText}</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question${i}" id="option1-${i}" value="option1">
                    <label class="form-check-label" for="option1-${i}">${question.options[0]}</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question${i}" id="option2-${i}" value="option2">
                    <label class="form-check-label" for="option2-${i}">${question.options[1]}</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question${i}" id="option3-${i}" value="option3">
                    <label class="form-check-label" for="option3-${i}">${question.options[2]}</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="question${i}" id="option4-${i}" value="option4">
                    <label class="form-check-label" for="option4-${i}">${question.options[3]}</label>
                </div>
            `;
            quizQuestions.appendChild(questionDiv);
        });

        showPage(quizPage);
    };

    function submitQuiz() {
        const quizIndex = quizzes.findIndex(quiz => quiz.title === quizTitleDisplay.textContent);
        const quiz = quizzes[quizIndex];
        let score = 0;

        quiz.questions.forEach((question, i) => {
            const selectedOption = document.querySelector(`input[name="question${i}"]:checked`);
            if (selectedOption && selectedOption.value === question.correctOption) {
                score++;
            }
        });

        feedbackMessage.textContent = `You got ${score} out of ${quiz.questions.length} correct!`;
        showPage(feedbackPage);
    }
});
