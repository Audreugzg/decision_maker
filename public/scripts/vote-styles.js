$(document).ready(function () {

  ///// FUNCTIONALITY OF DRAG AND DROP //////

  const $draggables = document.querySelectorAll(".draggable");
  const $containers = document.querySelectorAll(".options-container-test-drag");

  $draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  $containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  const allMovies = document.querySelectorAll("div.options-test");
  const allDescriptions = document.querySelectorAll(".description-fade");

  //// FUNCTIONALITY OF DOUBLE CLICK CLOSING ////
  $(allMovies).dblclick(function () {
    let movies = [];
    movies.push(this);
    const outer = movies[0].outerHTML;
    //let orderOfMovies = []
    let indexxO = $(this).index();

    for (let item in allMovies) {
      // orderOfMovies.push(item)
      if (allMovies[item].outerHTML === outer) indexxO = item;
    }

    if (allDescriptions[indexxO].classList.contains("show-description")) {
      allDescriptions[indexxO].classList.remove("show-description");
    } else {
      allDescriptions[indexxO].classList.add("show-description");
    }
  });

  //// FUNCTIONALITY OF DRAGGIN CLOSING DESCRIPTION ////

  $(allMovies).on("dragstart", () => {
    for (let movie of allMovies) {
      if (movie.classList.contains("dragging")) {
        for (let desc of allDescriptions)
          if (desc.classList.contains("show-description")) {
          } else {
            desc.classList.add("show-description");
          }
      }
    }
  });
});
