;(function($, window, document, undefined){

    var tableEvent = function(opt){
        this.tableWidth = 0;
        this.defaults = {
            "fix": false,
            "tableClass": "",
            "selfAdapt": true,
            "left":0,
            "top":0,
            "resize": true
        }
        this.opts = $.extend({}, this.defaults, opt);
        this.init();
    }

    tableEvent.prototype.init = function(){
        if(this.opts.resize&&!this.opts.fix){
            this.opts.ele.find('th').each(function(idx,ele){
                $(this).append($("<span class='resizeMove'></span>"));
            })
        }

        if(this.opts.resize){
            this.opts.ele.css({
                "width": "100%",
                "table-layout": "fixed"
            });
        }
        if(this.opts.fix){
            this.fixHeader();
        }
        this.bindEvent();
    }

    tableEvent.prototype.fixHeader = function() {
        var This = this;
        $(this.opts.parent).css({
            "position": "relative",
            "overflow": "hidden"
        });
        $("<div class='copyWraper'><table class='copyTable'><thead class='copyHead'></thead></table></div>").insertBefore(this.opts.ele);

        $(".copyWraper").css({
            "width": $(this.opts.parent).width(),
            "left": this.opts.left,
            "top": this.opts.top
        });
        this.opts.ele.wrap("<div class='sourceTable'></div>");
        $(".sourceTable").css({
            "width": $(this.opts.parent).width(),
            "height": $(this.opts.parent).height(),
            "left": this.opts.left,
            "top": this.opts.top
        })
        $(".copyTable").addClass(this.opts.tableClass).css("width", this.opts.ele.width());
        $(".copyWraper").css("height", this.opts.ele.find("thead").outerHeight());
        $(".copyHead").html(this.opts.ele.find("thead").html());
        $(".sourceTable").on("scroll", function() {
            $(".copyTable").css("left", -$(this).scrollLeft());
        });
        if(this.opts.resize&&this.opts.fix){
            $(".copyTable").find('th').each(function(idx,ele){
                $(this).append($("<span class='resizeMove'></span>"));
            })
        }
        if(this.opts.resize){
            $(".copyTable").css({
                "width": "100%",
                "table-layout": "fixed"
            });
        }
    };

    tableEvent.prototype.bindEvent = function(){
        var startX = 0;
        var endX = 0; 
        var disX = 0;
        var onOff = "off";
        var This = this;
        $(this.opts.parent).on('mousedown','.resizeMove', downFn);
        $(this.opts.parent).on('mouseup', upFn);

        function downFn(e){
            onOff = "on";
            startX = e.pageX;
            This.moveTh = $(this).closest("th");
            return false;
        }

        function upFn(e){
            if(onOff == "on"){
                endX = e.pageX;
                disX = endX - startX;
                var change = This.moveTh.width()+disX;
                if(This.opts.resize&&!This.opts.fix){
                    This.moveTh.css("width", change);
                }else if(This.opts.resize&&This.opts.fix){
                    var idx = This.moveTh.index();
                    This.opts.ele.find("th").eq(idx).css("width", change);
                    $(".copyTable").css("width", This.opts.ele.outerWidth());
                    This.moveTh.css("width", change);
                }
                onOff = "off";
                return false;
            }
        }
    }

    $.fn.extend({
        tableEvent: function(opts){
            return new tableEvent($.extend({},opts, {"ele": $(this)}));
        }
    })

})(jQuery,window,document);