var TxtType = function(el, toRotate, period, toDelete) {
    this.toRotate = toRotate;
    this.toDelete = toDelete;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.boldText = '';
    this.tick();
    this.isDeleting = false;
    this.isNextLine = false;
    this.isBold = false;
    this.length =0;
  };
  
  TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
  
    if(this.toDelete){
      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
  
    }else{
      if(this.isBold){
      this.length = this.txt.length + this.boldText.length + 1
      this.boldText = fullTxt.substring(this.txt.length + 1, this.length + 1)
      }else{
      this.length = this.txt.length + 1
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }}
  
    if(this.txt.at(-1) === "#"){
      this.txt = fullTxt.substring(0 , this.txt.length -1)
      this.isBold = true;
    }
  
  //  console.log("now: "+ this.length)
  //  console.log("full:" + fullTxt.length)
    if (this.length  >= fullTxt.length) {
      this.el.innerHTML = '<span class="bold-wrap">'+this.txt+'</span><span class="no-bold-wrap">'+this.boldText+'</span>';
      } else {
        this.el.innerHTML = '<span class="bold-wrap">'+this.txt+'</span><span class="no-bold-wrap">'+this.boldText+'|</span>';
      } 
      
    var that = this;
    var delta = 200 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }
  
    setTimeout(function() {
    that.tick();
    }, delta);
  };
  
  window.onload = function() {
    //ON THE RIGHT
    var elements = document.getElementsByClassName('typewrite');
  
    for (var i=0; i<elements.length; i++) {
        var toDelete =  JSON.parse(elements[i].getAttribute('to-delete'));
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period, toDelete);
        }
    }
  
  };


