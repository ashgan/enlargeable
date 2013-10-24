/*
 * Jquery Enlargeable plugin - https://github.com/popallo/enlargeable
 * Creation => 16-10-2013
 * Update => 23-10-2013
 * © 2013, Licensed MIT (https://github.com/popallo/enlargeable/blob/master/LICENSE)
 * @author popallo
 * @version 0.9.3
 * 
 * DEPENDS : jquery >= 1.10.x, jquery ui >= 1.10.x (optional)
 * 
 * HOW TO : $(element).enlargeable({option:value});
 * 
 * HTML EXAMPLE 1 :
 * 	<div class="enlargeable">
 * 		<table>
 * 
 * HTML EXAMPLE 2 :
 * 	<div class="enlargeJail">
 * 		<div class="enlargeable">
 * 			<table>
 * 
 * TODO make enlargeable fullscreenable... ^^
 * TODO make enlargeable skinnable... ^^
 * TODO(wip) make it works for "enlarge" or "reduce" size first
 * TODO make the plugin more flexible
 *
 */
;(function ( $ ) {
	'use strict';
	var Enlargeable = function( $options ) {
    	var $self = this;
		return this.each(function(){
        	var $oSettings = $.extend({}, Enlargeable.settings, $options),
				$element = $(this),
        		$enlargeBT = $('<div/>').addClass('enlargeBT').attr('title',''),
        		$tipTitle=$oSettings.enlargeTitle;
        	/* set options */
        	$oSettings.fnInit($oSettings);
        	/* in case of "tooltip" option is true, test if jquery ui is in da place ! */
			if($oSettings.tooltip && !$.ui){
	        	throw new Error('jquery.enlargeable requires jQuery ui 1.10.x OR make "tooltip" option to FALSE');
			}
			/* make the enlarge button */
			$element.parent().prepend($enlargeBT);
			/* tooltip init if "tooltip" option is true */
			$oSettings.tooltip?$('.enlargeBT').tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tipTitle }):'';
			/* click */
			$($enlargeBT,$element.parent()).on('click',function(){
				Enlargeable.click($oSettings, $enlargeBT, $element, $self);
			});
		});
    };
    /* default settings */
	Enlargeable.settings = {
    	start:'enlarge',						//how enlargeable element start ? (enlarge or reduce)
		tooltip:false,							//jquery ui tooltip ?
		targetWidth:'958px',					//target width
		targetHeight:'100%',					//target height
		enlargeTitle:'Enlarge',					//tooltip title for enlarge action
		reduceTitle:'Reduce',					//tooltip title for reduce action
		speed:'500',							//animation speed
		effect:'swing',							//easing effect
		fnInit: function(options){},			//init callback
		fnEnlargeClick: function(options){},	//enlarge click callback
		fnReduceClick: function(options){},		//reduce click callback
		fnEnlarge: function(options){},			//after enlarge callback
		fnReduce: function(options){}			//after reduce callback
	};
	/*
	 * Function click
	 * 
	 * @param {object}        $oSettings, enlargeable settings object
	 * @param {jquery object} $enlargeBT, the enlargeable button
	 * @param {jquery object} $element, the enlargeable element
	 * @param {jquery object} $element, enlargeable object
	 * 
	 */
	Enlargeable.click = function($oSettings, $enlargeBT, $element, $self){
		var $activeClick = true,
			$tipTitle;
		/* flood click protection ^^ */
		if(!$activeClick){return;} 
		$activeClick = false;
		/* enlarge action */
		if(!$enlargeBT.hasClass('reduce')){
			/* enlarge click callback */
			$oSettings.fnEnlargeClick($oSettings);
			/* enlarge function */
			$self.originalSize = Enlargeable.enlarge($oSettings, $element);
			/* redefine tooltip title -> return elements with their original sizes */
			$tipTitle=$oSettings.reduceTitle;
		}else{ //reduce action
			/* reduce click callback */
			$oSettings.fnReduceClick($oSettings);
			/* reduce function */
			Enlargeable.reduce($oSettings, $self.originalSize);
			/* redefine tooltip title */
			$tipTitle=$oSettings.enlargeTitle;
		}
		/* add or remove "reduce" class to the enlarge button */
		$enlargeBT.toggleClass('reduce'); //add or remove .reduce class
		/* set tooltip title */
		$oSettings.tooltip?$enlargeBT.tooltip({position: { my: "center bottom-20", at: "right top" }, content: $tipTitle }):'';
		/* "reactive" click when timeout = speed option */
		setTimeout(function() {$activeClick = true;}, $oSettings.speed);
	};
    /*
     * Function enlarge
     * 
	 * @param {object}        $oSettings, enlargeable settings object
	 * @param {jquery object} $element, the enlargeable element
	 * 
	 */
    Enlargeable.enlarge = function($oSettings, $element) {
		var $oElement = {
				element:$element,
				width:$element.width(),
				height:$element.height()
			},
			$elementMaxHeight = $element.css('max-height').length, //useful if element has a max-height defined
			$parents = $element.parents('.enlargeJail'),
			$aParents = [],
			$o = {};
		$parents.each(function(){
			var $this = $(this);
			$aParents.push({
				element:$this,
				width:$this.width(),
				height:$this.height()
			});
			$this.animate({width:$oSettings.targetWidth,height:$oSettings.targetHeight},$oSettings.speed,$oSettings.effect);
		});
		$element.animate({width:$oSettings.targetWidth,height:$oSettings.targetHeight},$oSettings.speed,$oSettings.effect,function(){
			$oSettings.fnEnlarge($oSettings);
		});
		if($elementMaxHeight>0){
			$element.css('max-height',$oSettings.targetHeight);
		}
		return $o = {
			oElement:$oElement,
			aParents:$aParents
		};
    };
    /*
	 * Function reduce
	 * 
	 * @param {object}    $oSettings, enlargeable settings object
	 * @param {object}    $oSize, enlargeable element and enlargeJail elements originals sizes
	 * 
	 */
    Enlargeable.reduce = function($oSettings, $oSize) {
    	if(typeof $oSize === 'undefined'){}
    	var $element = $oSize.oElement.element;
    	$.each($oSize.aParents, function(){
			this.element.animate({width:this.width+'px',height:this.height+'px'},$oSettings.speed,$oSettings.effect);
    	});
		$element.animate({width:$oSize.oElement.width+'px',height:$oSize.oElement.height+'px'},$oSettings.speed,$oSettings.effect, function(){
			$oSettings.fnReduce($oSettings);
		});
    };
	/*
	 * Function Debug
	 * 
	 */
	Enlargeable.debug = function($msg){
		if(window.console && window.console.log) 
			console.log( "[debug] " + $msg ); 
	};
	/* jQuery aliases */
	$.fn.enlargeable = Enlargeable;
}( $ ));
