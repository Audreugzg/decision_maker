$(document).ready(function () {

  $( window ).load(() => {
    for (let i = 0; i < /* see the name of the array*/ranking.length; i++) {
      option();
    }

    })

  const option = function() {
    const $options = $(
      `<div class="bar-chart-div">
      <div class="option-div">
        <div class="option-with-percentage">
          <span class="option-span">Option </span>
          <span class="percentage">${''}</span>
        </div>
        <span class="bar-span style= "width:${''}"> ................</span>
      </div>`
      )

      return $options
    }


  }
















})
