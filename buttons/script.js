document.addEventListener("DOMContentLoaded", function(event) {
  var link = document.getElementById("superhero-tip-link");
  var search = new URL(window.location.href).searchParams.get("url");
  var tipUrl = search ? search : window.location.href;
  var url = new URL('https://wallet.superhero.com/tip');
  url.searchParams.set('url', encodeURIComponent(tipUrl));
  url.searchParams.set('x-success', tipUrl);
  url.searchParams.set('x-cancel', tipUrl);
  link.href = url;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://raendom-backend.z52da5wt.xyz/cache/stats', true);
  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
              var res = JSON.parse(xmlhttp.responseText);
              var tips = 0;
              for (var i = 0; i < res.by_url.length; i++) { 
                if (res.by_url[i].url === tipUrl) { 
                  tips = res.by_url[i].total_amount;
                  break;
                } 
              }
              var tipsEl = document.getElementById("tips");
              if (tipsEl) tipsEl.text = tips;
          }
      }
  }
  xmlhttp.send(null);
});