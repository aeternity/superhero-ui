var buttonUrl = "https://superhero.com/buttons/v1/";
document.addEventListener("DOMContentLoaded", function(event) {
  var buttons = document.getElementsByClassName("superhero-tip-button");
  var iframes = [];
  for (var i = 0; i < buttons.length; i++) {
    var size = buttons[i].getAttribute("data-size") ? buttons[i].getAttribute("data-size") : "icon";
    var href = buttons[i].getAttribute("data-href") ? buttons[i].getAttribute("data-href") : window.location.href;
    var account = buttons[i].getAttribute("data-account");

    var iframe = document.createElement('iframe');
    iframe.src = buttonUrl + size + "?url=" + href;
    iframe.setAttribute('style','max-width:210px;max-height:120px;overflow:hidden;');
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "0");
    if (account) iframe.setAttribute("data-account", account);
    iframes[i] = iframe;
  }

  for(var f in iframes) {
    document.getElementsByClassName("superhero-tip-button")[0].replaceWith(iframes[f]);
  }
});