<template>
  <div ref="item"
    class="vue-grid-item"
    :class="{ 'vue-resizable' : resizable, 'resizing' : isResizing, 'vue-draggable-dragging' : isDragging, 'cssTransforms' : useCssTransforms, 'render-rtl' : renderRtl, 'disable-userselect': isDragging }"
    :style="style"
  >
    <div class="module">
      <div class="module-title">
        <slot name="title">
          <Icon :type="icon"></Icon>{{title}} 
          <span v-if="visible">{{number}}</span>
        </slot>
        <Icon type="close-round" @click="remove()" class="close" v-if="operable"></Icon>
      </div>
      <div class="module-body">
        <slot></slot>
      </div>
    </div>
    <span v-if="resizable" ref="handle" :class="resizableHandleClass"></span>
  </div>
</template>

<script>
import {setTopLeft, setTopRight, setTransformRtl, setTransform, createMarkup, getLayoutItem} from '../js/utils';
import {getControlPosition, offsetXYFromParentOf, createCoreData} from '../js/draggableUtils';
    //    var eventBus = require('./eventBus');

var interact = require("interactjs");

export default {
    name: "mdPending",
    props: {
        isDraggable: {
            type: Boolean,
            required: false,
            default: null
        },
        isResizable: {
            type: Boolean,
            required: false,
            default: null
        },
        minH: {
            type: Number,
            required: false,
            default: 1
        },
        minW: {
            type: Number,
            required: false,
            default: 1
        },
        maxH: {
            type: Number,
            required: false,
            default: Infinity
        },
        maxW: {
            type: Number,
            required: false,
            default: Infinity
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        w: {
            type: Number,
            required: true
        },
        h: {
            type: Number,
            required: true
        },
        i: {
            required: true
        },
        dragIgnoreFrom: {
            type: String,
            required: false,
            default: 'a, button'
        },
        dragAllowFrom: {
            type: String,
            required: false,
            default: null
        },
        resizeIgnoreFrom: {
            type: String,
            required: false,
            default: 'a, button'
        },
        title: {
            type: String,
            defaule: ''
        },
        icon: {
            type: String,
            defaule: 'navicon-round'
        },
        visible: {
            type: Boolean,
            defaule: false
        },
        number: {
            type: Number,
            defaule: null
        },
        operable: {
            type: Boolean,
            defaule: false
        }
    },
    inject: ["eventBus"],
    data: function () {
        return {
            cols: 1,
            containerWidth: 100,
            rowHeight: 30,
            margin: [10, 10],
            maxRows: Infinity,
            draggable: null,
            resizable: null,
            useCssTransforms: true,

            isDragging: false,
            dragging: null,
            isResizing: false,
            resizing: null,
            lastX: NaN,
            lastY: NaN,
            lastW: NaN,
            lastH: NaN,
            style: {},
            rtl: false,

            dragEventSet: false,
            resizeEventSet: false,

            previousW: null,
            previousH: null,
            previousX: null,
            previousY: null,
            innerX: this.x,
            innerY: this.y,
            innerW: this.w,
            innerH: this.h
        };
    },
    created () {
        var self = this;

            // Accessible refernces of functions for removing in beforeDestroy
        self.updateWidthHandler = function (width) {
            self.updateWidth(width);
        };

        self.compactHandler = function (layout) {
            self.compact(layout);
        };

        self.setDraggableHandler = function (isDraggable) {
            if (self.isDraggable === null) {
                self.draggable = isDraggable;
            }
        };

        self.setResizableHandler = function (isResizable) {
            if (self.isResizable === null) {
                self.resizable = isResizable;
            }
        };

        self.setRowHeightHandler = function (rowHeight) {
            self.rowHeight = rowHeight;
        };

        self.directionchangeHandler = (direction) => {
            var direction = (document.dir !== undefined)
                    ? document.dir
                    : document.getElementsByTagName("html")[0].getAttribute("dir");
            this.rtl = (direction === "rtl");
            this.compact();
        };

        self.setColNum = (colNum) => {
            self.cols = parseInt(colNum);
        };

        this.eventBus.$on('updateWidth', self.updateWidthHandler);
        this.eventBus.$on('compact', self.compactHandler);
        this.eventBus.$on('setDraggable', self.setDraggableHandler);
        this.eventBus.$on('setResizable', self.setResizableHandler);
        this.eventBus.$on('setRowHeight', self.setRowHeightHandler);
        this.eventBus.$on('directionchange', self.directionchangeHandler);
        this.eventBus.$on('setColNum', self.setColNum);

        var direction = (document.dir !== undefined)
                ? document.dir
                : document.getElementsByTagName("html")[0].getAttribute("dir");
        this.rtl = (direction === "rtl");
    },
    beforeDestroy: function(){
        var self = this;
            //Remove listeners
        this.eventBus.$off('updateWidth', self.updateWidthHandler);
        this.eventBus.$off('compact', self.compactHandler);
        this.eventBus.$off('setDraggable', self.setDraggableHandler);
        this.eventBus.$off('setResizable', self.setResizableHandler);
        this.eventBus.$off('setRowHeight', self.setRowHeightHandler);
        this.eventBus.$off('directionchange', self.directionchangeHandler);
        this.eventBus.$off('setColNum', self.setColNum);
    },
    mounted: function () {
        this.cols = this.$parent.colNum;
        this.rowHeight = this.$parent.rowHeight;
        this.containerWidth = this.$parent.width !== null ? this.$parent.width : 100;
        this.margin = this.$parent.margin !== undefined ? this.$parent.margin : [10, 10];
        this.maxRows = this.$parent.maxRows;
        if (this.isDraggable === null) {
            this.draggable = this.$parent.isDraggable;
        } else {
            this.draggable = this.isDraggable;
        }
        if (this.isResizable === null) {
            this.resizable = this.$parent.isResizable;
        } else {
            this.resizable = this.isResizable;
        }
        this.useCssTransforms = this.$parent.useCssTransforms;
        this.createStyle();
    },
    watch: {
        isDraggable: function () {
            this.draggable = this.isDraggable;
        },
        draggable: function () {
            var self = this;
            if (this.interactObj === null || this.interactObj === undefined) {
                this.interactObj = interact(this.$refs.item);
            }
            if (this.draggable) {
                var opts = {
                        ignoreFrom: this.dragIgnoreFrom,
                        allowFrom: this.dragAllowFrom
                    };
                this.interactObj.draggable(opts);

                    /*this.interactObj.draggable({allowFrom: '.vue-draggable-handle'});*/
                if (!this.dragEventSet) {
                        this.dragEventSet = true;
                        this.interactObj.on('dragstart dragmove dragend', function (event) {
                            self.handleDrag(event);
                        });
                    }
            } else {
                this.interactObj.draggable({
                        enabled: false
                    });
            }
        },
        isResizable: function () {
            this.resizable = this.isResizable;
        },
        resizable: function () {
            var self = this;
            if (this.interactObj === null || this.interactObj === undefined) {
                this.interactObj = interact(this.$refs.item);
            }
            if (this.resizable) {
                var opts = {
                        preserveAspectRatio: false,
                        edges: {
                            left: false,
                            right: "." + this.resizableHandleClass,
                            bottom: "." + this.resizableHandleClass,
                            top: false
                        },
                        ignoreFrom: this.resizeIgnoreFrom
                    };

                this.interactObj.resizable(opts);
                if (!this.resizeEventSet) {
                        this.resizeEventSet = true;
                        this.interactObj
                            .on('resizestart resizemove resizeend', function (event) {
                                self.handleResize(event);
                            });
                    }
            } else {
                this.interactObj.resizable({
                        enabled: false
                    });
            }
        },
        rowHeight: function () {
            this.createStyle();
        },
        cols: function () {
            this.createStyle();
        },
        containerWidth: function () {
            this.createStyle();
        },
        x: function (newVal) {
            this.innerX = newVal;
            this.createStyle();
        },
        y: function (newVal) {
            this.innerY = newVal;
            this.createStyle();
        },
        h: function (newVal) {
            this.innerH = newVal;
            this.createStyle();
        },
        w: function (newVal) {
            this.innerW = newVal;
            this.createStyle();
        },
        renderRtl: function () {
            this.createStyle();
        }
    },
    computed: {
        renderRtl() {
            return (this.$parent.isMirrored) ? !this.rtl : this.rtl;
        },
        resizableHandleClass() {
            if (this.renderRtl) {
                return 'vue-resizable-handle vue-rtl-resizable-handle';
            } else {
                return 'vue-resizable-handle';
            }
        }
    },
    methods: {
        createStyle: function () {
            if (this.x + this.w > this.cols) {
                this.innerX = 0;
                this.innerW = (this.w > this.cols) ? this.cols : this.w;
            } else {
                this.innerX = this.x;
                this.innerW = this.w;
            }
            var pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);

            if (this.isDragging) {
                pos.top = this.dragging.top;
//                    Add rtl support
                if (this.renderRtl) {
                        pos.right = this.dragging.left;
                    } else {
                        pos.left = this.dragging.left;
                    }
            }
            if (this.isResizing) {
                pos.width = this.resizing.width;
                pos.height = this.resizing.height;
            }

            let style;
                // CSS Transforms support (default)
            if (this.useCssTransforms) {
//                    Add rtl support
                if (this.renderRtl) {
                        style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
                    } else {
                        style = setTransform(pos.top, pos.left, pos.width, pos.height);
                    }

            } else { // top,left (slow)
//                    Add rtl support
                if (this.renderRtl) {
                        style = setTopRight(pos.top, pos.right, pos.width, pos.height);
                    } else {
                        style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
                    }
            }
            this.style = style;

        },
        handleResize: function (event) {
            const position = getControlPosition(event);
                // Get the current drag point from the event. This is used as the offset.
            if (position == null) {return;} // not possible but satisfies flow
            const {x, y} = position;

            const newSize = {width: 0, height: 0};
            switch (event.type) {
                case "resizestart":
                    this.previousW = this.innerW;
                    this.previousH = this.innerH;
                    var pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
                    newSize.width = pos.width;
                    newSize.height = pos.height;
                    this.resizing = newSize;
                    this.isResizing = true;
                    break;
                case "resizemove":
//                        console.log("### resize => " + event.type + ", lastW=" + this.lastW + ", lastH=" + this.lastH);
                    const coreEvent = createCoreData(this.lastW, this.lastH, x, y);
                    if (this.renderRtl) {
                            newSize.width = this.resizing.width - coreEvent.deltaX;
                        } else {
                            newSize.width = this.resizing.width + coreEvent.deltaX;
                        }
                    newSize.height = this.resizing.height + coreEvent.deltaY;

                        ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
                    this.resizing = newSize;
                    break;
                case "resizeend":
                        //console.log("### resize end => x=" +this.innerX + " y=" + this.innerY + " w=" + this.innerW + " h=" + this.innerH);
                    var pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
                    newSize.width = pos.width;
                    newSize.height = pos.height;
//                        console.log("### resize end => " + JSON.stringify(newSize));
                    this.resizing = null;
                    this.isResizing = false;
                    break;
            }

                // Get new WH
            var pos = this.calcWH(newSize.height, newSize.width);
            if (pos.w < this.minW) {
                pos.w = this.minW;
            }
            if (pos.w > this.maxW) {
                pos.w = this.maxW;
            }
            if (pos.h < this.minH) {
                pos.h = this.minH;
            }
            if (pos.h > this.maxH) {
                pos.h = this.maxH;
            }

            if (pos.h < 1) {
                pos.h = 1;
            }
            if (pos.w < 1) {
                pos.w = 1;
            }

            this.lastW = x;
            this.lastH = y;

            if (this.innerW !== pos.w || this.innerH !== pos.h) {
                this.$emit("resize", this.i, pos.h, pos.w);
            }
            if (event.type === "resizeend" && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
                this.$emit("resized", this.i, pos.h, pos.w, newSize.height, newSize.width);
            }
            this.eventBus.$emit("resizeEvent", event.type, this.i, this.innerX, this.innerY, pos.h, pos.w);
        },
        handleDrag(event) {
            if (this.isResizing) {return;}

            const position = getControlPosition(event);

                // Get the current drag point from the event. This is used as the offset.
            if (position === null) {return;} // not possible but satisfies flow
            const {x, y} = position;

            var shouldUpdate = false;
            const newPosition = {top: 0, left: 0};
            switch (event.type) {
                case "dragstart":
                    this.previousX = this.innerX;
                    this.previousY = this.innerY;

                    var parentRect = event.target.offsetParent.getBoundingClientRect();
                    var clientRect = event.target.getBoundingClientRect();
                    if (this.renderRtl) {
                            newPosition.left = (clientRect.right - parentRect.right) * -1;
                        } else {
                            newPosition.left = clientRect.left - parentRect.left;
                        }
                    newPosition.top = clientRect.top - parentRect.top;
                    this.dragging = newPosition;
                    this.isDragging = true;
                    break;
                case "dragend":
                    if (!this.isDragging) {return;}
                    parentRect = event.target.offsetParent.getBoundingClientRect();
                    clientRect = event.target.getBoundingClientRect();
//                        Add rtl support
                    if (this.renderRtl) {
                            newPosition.left = (clientRect.right - parentRect.right) * -1;
                        } else {
                            newPosition.left = clientRect.left - parentRect.left;
                        }
                    newPosition.top = clientRect.top - parentRect.top;
//                        console.log("### drag end => " + JSON.stringify(newPosition));
//                        console.log("### DROP: " + JSON.stringify(newPosition));
                    this.dragging = null;
                    this.isDragging = false;
                    shouldUpdate = true;
                    break;
                case "dragmove":
                    const coreEvent = createCoreData(this.lastX, this.lastY, x, y);
//                        Add rtl support
                    if (this.renderRtl) {
                            newPosition.left = this.dragging.left - coreEvent.deltaX;
                        } else {
                            newPosition.left = this.dragging.left + coreEvent.deltaX;
                        }
                    newPosition.top = this.dragging.top + coreEvent.deltaY;
//                        console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
//                        console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
//                        console.log("### drag end => " + JSON.stringify(newPosition));
                    this.dragging = newPosition;
                    break;
            }

                // Get new XY
            if (this.renderRtl) {
                var pos = this.calcXY(newPosition.top, newPosition.left);
            } else {
                var pos = this.calcXY(newPosition.top, newPosition.left);
            }

            this.lastX = x;
            this.lastY = y;

            if (this.innerX !== pos.x || this.innerY !== pos.y) {
                this.$emit("move", this.i, pos.x, pos.y);
            }
            if (event.type === "dragend" && (this.previousX !== this.innerX || this.previousY !== this.innerY)) {
                this.$emit("moved", this.i, pos.x, pos.y);
            }
            this.eventBus.$emit("dragEvent", event.type, this.i, pos.x, pos.y, this.innerH, this.innerW);
        },
        calcPosition: function (x, y, w, h) {
            const colWidth = this.calcColWidth();
                // add rtl support
            if (this.renderRtl) {
                var out = {
                        right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                        // 0 * Infinity === NaN, which causes problems with resize constriants;
                        // Fix this if it occurs.
                        // Note we do it here rather than later because Math.round(Infinity) causes deopt
                        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                    };
            } else {
                var out = {
                        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
                        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
                        // 0 * Infinity === NaN, which causes problems with resize constriants;
                        // Fix this if it occurs.
                        // Note we do it here rather than later because Math.round(Infinity) causes deopt
                        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                    };
            }

            return out;
        },

            /**
             * Translate x and y coordinates from pixels to grid units.
             * @param  {Number} top  Top position (relative to parent) in pixels.
             * @param  {Number} left Left position (relative to parent) in pixels.
             * @return {Object} x and y in grid units.
             */
            // TODO check if this function needs change in order to support rtl.
        calcXY(top, left) {
            const colWidth = this.calcColWidth();

                // left = colWidth * x + margin * (x + 1)
                // l = cx + m(x+1)
                // l = cx + mx + m
                // l - m = cx + mx
                // l - m = x(c + m)
                // (l - m) / (c + m) = x
                // x = (left - margin) / (coldWidth + margin)
            let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
            let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

                // Capping
            x = Math.max(Math.min(x, this.cols - this.innerW), 0);
            y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);

            return {x, y};
        },
            // Helper for generating column width
        calcColWidth() {
            var colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
               // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);
            return colWidth;
        },

            /**
             * Given a height and width in pixel values, calculate grid units.
             * @param  {Number} height Height in pixels.
             * @param  {Number} width  Width in pixels.
             * @return {Object} w, h as grid units.
             */
        calcWH(height, width) {
            const colWidth = this.calcColWidth();

                // width = colWidth * w - (margin * (w - 1))
                // ...
                // w = (width + margin) / (colWidth + margin)
            let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
            let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));

                // Capping
            w = Math.max(Math.min(w, this.cols - this.innerX), 0);
            h = Math.max(Math.min(h, this.maxRows - this.innerY), 0);
            return {w, h};
        },
        updateWidth: function (width, colNum) {
            this.containerWidth = width;
            if (colNum !== undefined && colNum !== null) {
                this.cols = colNum;
            }
        },
        compact: function () {
            this.createStyle();
        }
    },
};
</script>

<style>

</style>
