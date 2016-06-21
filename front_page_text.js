var front_page_text = {
selectionTitle:"SELECTION FACTORS AND METHODOLOGICAL PROCESS",
populationTitle:"POPULATION GROWTH AS PROXY",
selection:"Impetus vivendum iudicabit has in, clita constituto per ad. Congue argumentum necessitatibus at usu, eam in tantas epicurei. Sed no meis constituam, eu vero recusabo mel. Aliquam temporibus ullamcorper nec ad. Et maiorum expetenda vix, gloriatur argumentum ea sed. Eam ignota detracto corrumpit ex, sea tempor regione argumentum at. Est quodsi vidisse phaedrum id.",
population:"Possit disputando eu mel, et dolorum accumsan omnesque sea. Cu mel saperet dolores accommodare, option efficiantur ius ne. Cetero aeterno qualisque his ad, dico nibh vim ea. Eius errem everti ut sea. Ne constituam consectetuer eum, ne pro consul omnesque deleniti. Ex possim delenit vix, timeam fierent et cum, te cum alterum omittam constituto."
}

function frontPageText(){
  var pTitleDiv = d3.select("#text").append("div").attr("id","pTitle").attr("class","subtitle")
  var populationDiv = d3.select("#text").append("div").attr("id","population")
  var sTitleDiv = d3.select("#text").append("div").attr("id","sTitle").attr("class","subtitle")
  var selectionDiv = d3.select("#text").append("div").attr("id","selection")
  
  pTitleDiv.html(front_page_text["populationTitle"])
  sTitleDiv.html(front_page_text["selectionTitle"])
  
  populationDiv.html(front_page_text["population"])
  selectionDiv.html(front_page_text["selection"])
}
frontPageText()