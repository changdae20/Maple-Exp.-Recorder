function get_date() {
  return new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1);
}

function get_exp(nick){
  var url = "http://maplestory.nexon.com/Ranking/World/Total?c="+nick;
  var response = UrlFetchApp.fetch(url).getContentText();
  
  var nick_index1 = response.indexOf("캐릭터 랭킹 검색");
  //return response.substring(nick_index1,nick_index1+100000)
  var nick_index2 = response.substring(nick_index1,nick_index1+100000).indexOf(nick);
  var td_index1 = response.substring(nick_index1+nick_index2,nick_index1+nick_index2+100000).indexOf("<td>") + 1;
  //return response.substring(nick_index1+nick_index2+td_index1,nick_index1+nick_index2+td_index1+100)
  var td_index2 = response.substring(nick_index1+nick_index2+td_index1,nick_index1+nick_index2+td_index1+100000).indexOf("<td>");
  //return response.substring(nick_index1+nick_index2+td_index1+td_index2,nick_index1+nick_index2+td_index1+td_index2+10)
  var td_index3 = response.substring(nick_index1+nick_index2+td_index1+td_index2,nick_index1+nick_index2+td_index1+td_index2+100000).indexOf("</td>");
  var ret = response.substring(nick_index1+nick_index2+td_index1+td_index2+4,nick_index1+nick_index2+td_index1+td_index2+td_index3);
  return ret.replace(/,/g,"");
}

function get_level(nick){
  var url = "http://maplestory.nexon.com/Ranking/World/Total?c="+nick;
  var response = UrlFetchApp.fetch(url).getContentText();
  
  var nick_index1 = response.indexOf("캐릭터 랭킹 검색");
  //return response.substring(nick_index1,nick_index1+100000)
  var nick_index2 = response.substring(nick_index1,nick_index1+100000).indexOf(nick);
  
  var td_index1 = response.substring(nick_index1+nick_index2,nick_index1+nick_index2+100000).indexOf("Lv.");
  var td_index2 = response.substring(nick_index1+nick_index2+td_index1,nick_index1+nick_index2+td_index1+100000).indexOf("</td>");
  
  return response.substring(nick_index1+nick_index2+td_index1+3,nick_index1+nick_index2+td_index1+td_index2);
}
  
function update(){
  var list = ["관성"];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("기록");
  var count_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("count");
  var exp_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("경험치");
  var append_list = [];
  var count = count_sheet.getRange(1,1).getValue();
  append_list.push(get_date());
  for(var i=0;i<list.length;i++){ // 차례대로 레벨, 경험치, "/", 경험치바, 비율, 전날대비상승(절대), 전날대비상승(상대)
    var level = get_level(list[i]);
    var exp = get_exp(list[i]);
    var exp_bar = exp_sheet.getRange(level,1).getValue();
    var delta = exp - sheet.getRange(count,3 + 7*i).getValue();
    if(level>sheet.getRange(count,2 + 7*i).getValue().toString().substring(3,6)){
      delta = delta + sheet.getRange(count,5 + 7*i).getValue();
    }
    append_list.push("Lv."+level);
    append_list.push(Number(exp));
    append_list.push("/");
    append_list.push(Number(exp_bar));
    append_list.push("=("+((Number(exp)/Number(exp_bar))*100).toString() + "%)");
    append_list.push(delta);
    append_list.push(delta/(sheet.getRange(count,5 + 7*i).getValue()));
  }
  sheet.appendRow(append_list);
  count_sheet.getRange(1,1).setValue(count+1);
}

function MapleFloor(Name) {
  
  var url = "https://maple.gg/u/"+Name;
  var response = UrlFetchApp.fetch(url);
  var test = response.getContentText();
  var index = test.indexOf("최고무릉");
  
  if(index>-1){
    var floor = test.substring(index+5,index+8).indexOf("층");
    return test.substring(index+5,index+5+floor);
  }
  else
    return;
}
