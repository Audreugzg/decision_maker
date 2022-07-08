$(document).ready(function () {
console.log("hello");
$(".pollSubmission").submit(function(e) {
  const optionOrders = [];
  $(this).find(".options-test").each(function(i,optionElement) {
    optionOrders.push($(optionElement).data("option"));
  })
  const pageUrl = $(location).attr("href").split("/");
  const key = pageUrl[5];
  console.log(key);
  console.log(optionOrders);
   $.ajax(`/api/results/`, {method: 'POST', data: {optionOrders,key}});
})
})
