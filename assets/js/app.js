document.addEventListener("DOMContentLoaded", function () {

  const askBtn = document.querySelector("#askBtn");
  const layer = document.querySelector(".layer");
  const modal = document.querySelector(".modal");
  const close = document.querySelector(".close");
  const saveBtn = document.querySelector("#saveBtn");
  const cancel = document.querySelector("#cancel");
  const numOfQuestions = document.querySelector("#numOfQuestions");
  const filter = document.querySelector("#filter");

  // Get data from localStorage
  const getLocalStorage = (questions) => {
    return localStorage.getItem(questions)
      ? JSON.parse(localStorage.getItem(questions))
      : [];
  };

  // Sort questions by date
  const sortQuestionsByDate = (questionsData) => questionsData.sort((a, b) => b.dateMilliseconds - a.dateMilliseconds);

  // Sets number of questions in DOM
  const setNumOfQuestions = (questionsData) => {
    return (numOfQuestions.innerHTML = `Questions: ${questionsData?.length || 0}`);
  };

  // Render questions in DOM
  const loadQuestions = (questionsData) => {
    const container = document.querySelector(".questions-section__content");
    container.innerHTML = questionsData
      ?.map((question) =>
      QuestionComponent(question.question, question.category, question.dateString)
      )
      .join("");

    // Set number of questions in DOM
    setNumOfQuestions(questionsData);
  };

  // Single Question Component
  const QuestionComponent = (question, category, date) => {
    return `
        <div class="question">
          <div class="questin__text">
              <p>${question}</p>
          </div>
          <div class="question__category">
              <p>${category}</p>
          </div>
          <div class="question__date"><p>${formatDate(date)}</p></div>
        </div>
        `;
  };

  // Format date => 23.10.2022 klo 18:43:12
  const formatDate = (string) => {
    let result = "";
    result += string.slice(0, 10) + " klo " + (Number(string.slice(11, 13)) + Number(3)) + ":" + string.slice(14, 19)
    return result;
  }
  // Save data, update localStorage, sort them and load.
  const saveData = () => {
    const question = document.querySelector("#question");
    const category = document.querySelector("#category");

    if (question.value === "") {
      return Swal.fire("Warning!", "Please type your question.", "warning");
    } else if (category.value === "category") {
      return Swal.fire("Warning!", "Please choose one category.", "warning");
    } else {
      // date
      const dateMilliseconds = new Date().getTime();
      const dateString = new Date(dateMilliseconds).toISOString();

      // form data
      const formData = {
      id: Math.floor(Math.random() * 99999),
      question: question.value,
      category: category.value,
      dateMilliseconds: dateMilliseconds,
      dateString: dateString,
      }
      
      const questionsData = getLocalStorage("questions");
      questionsData.push(formData);
      localStorage.setItem("questions", JSON.stringify(questionsData));
      Swal.fire("Great!", "Question added successfully.", "success");
      question.value = "";
      category.value = "category";
      layer.classList.remove("showLayer");
      modal.classList.remove("active");
      const sortedQuestions = sortQuestionsByDate(questionsData)
      loadQuestions(sortedQuestions);
    }

  }
  // Filter questions
  const filterQuestions = (e) => {
    const keyword = e.target.value;
    if (keyword === "all") {
      const questions = getLocalStorage("questions")
      const sortedQuestions = sortQuestionsByDate(questions)
      return loadQuestions(sortedQuestions);
    } else {
      const questionsFromStorage = getLocalStorage("questions")
      const sorted = sortQuestionsByDate(questionsFromStorage)
      const filteredQuestions = sorted.filter(
        (question) => question.category === keyword
      );
      return loadQuestions(filteredQuestions);
    }
  }

  // All event listeners
  // Filters questions
  filter.addEventListener("change", filterQuestions);
  // When clicks on save button
  saveBtn.addEventListener("click", saveData);
  // when clicks on ask button
  askBtn.addEventListener("click", () => {
    layer.classList.add("showLayer");
    modal.classList.add("active");
  });

  // When clicks on modal close button
  close.addEventListener("click", () => {
    layer.classList.remove("showLayer");
    modal.classList.remove("active");
  });
  // When clicks on cencel button on modal
  cancel.addEventListener("click", () => {
    layer.classList.remove("showLayer");
    modal.classList.remove("active");
    question.value = "";
    category.value = "category"
  });

  // Initial loading
  const questionsData = getLocalStorage("questions");
  const sortedQuestions = sortQuestionsByDate(questionsData)
  loadQuestions(sortedQuestions);


});
