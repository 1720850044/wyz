<template>
    <main>
        <svg :width="width" height="240"></svg>
        <form>
            <!--<label><input type="radio" name="mode" value="sumBySize" checked> Size</label>-->
            <!--<label><input type="radio" name="mode" value="sumByCount"> Count</label>-->
        </form>
    </main>
</template>

<script>
//    import * as d3 from '/static/d3.js';
    export default {
        created() {
        },
        mounted() {

        },
        props: {
            width: {
                type: String
            }
        },
        data() {
            return {};
        },
        methods: {
            init(newWidth) {
                let rectWH = null; // reac宽高
                let num = null; // 百分比
                // 找到对象获取宽高
                var svg = d3.select("svg"),
                    width = newWidth,
                    height = +svg.attr("height");

                // 颜色
                var fader = function (color) {
                        return d3.interpolateRgb(color, "#fff")(0.2);
                    },
                    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
                    format = d3.format(",d");

                var treemap = d3.treemap()
                    .tile(d3.treemapResquarify)
                    .size([width, height])
                    .round(true)
                    .paddingInner(1);

                d3.json("http://localhost:80/src/static/flare.json", function (error, data) {
                    if (error) {throw error;}
                    var root = d3.hierarchy(data).eachBefore(function (d) {
                        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
                    }).sum(sumBySize).sort(function (a, b) {
                        return b.height - a.height || b.value - a.value;
                    });

                    treemap(root);
                    // 初始化位置
                    var cell = svg.selectAll("g")
                        .data(root.leaves())
                        .enter().append("g")
                        .attr("transform", function (d) {
                            return "translate(" + d.x0 + "," + d.y0 + ")";
                        });
                    // 颜色和图形
                    let x = null;
                    let y = null;
                    cell.append("rect")
                        .attr("id", function (d) {
                            return d.data.id;
                        })
                        .attr("width", function (d) {
                            rectWH = Object.assign({}, d);
                            x = d.x1 - d.x0;
                            return d.x1 - d.x0;
                        })
                        .attr("height", function (d) {
                            y = d.y1 - d.y0;
                            return d.y1 - d.y0;
                        })
                        .attr("fill", function (d) {

                            return color(Math.random());
                        });

                    cell.append("clipPath")
                        .attr("id", function (d) {
                            return "clip-" + d.data.id;
                        })
                        .append("use")
                        .attr("xlink:href", function (d) {
                            return "#" + d.data.id;
                        });

                    // 文本相关
                    num = root.value;
                    cell.append("text")
                        .attr("clip-path", function (d) {
                            return "url(#clip-" + d.data.id + ")";
                        })
                        .style('color', '#fff')
                        .selectAll("tspan")
                        .data(function (d) {
                            return (d.data.name + Math.round(d.data.size * 100 / num) + '%').split(/(?=[A-Z][^A-Z])/g);
                        })
                        .style('color', '#fff')
                        .enter().append("tspan")
                        .attr("x", (d, i) => 
//                            return (rectWH.x1 - rectWH.x0) / 2
                             4)
                        .attr("y", function (d, i) {
                            return (rectWH.y1 - rectWH.y0) / 2;
                        })
                        .text(function (d) {
                            return d;
                        });

                    cell.append("title")
                        .text(function (d) {
                            return d.data.id + "\n" + format(d.value);
                        })
                        .style('color', '#fff');

                    d3.selectAll("input")
                        .data([sumBySize, sumByCount], function (d) {
                            return d ? d.name : this.value;
                        })
                        .on("change", changed);

                    var timeout = d3.timeout(function () {
                        d3.select("input[value=\"sumByCount\"]")
                            .property("checked", true)
                            .dispatch("change");
                    }, 2000);

                    function changed(sum) {
                        timeout.stop();

                        treemap(root.sum(sum));

                        cell.transition()
                            .duration(750)
                            .attr("transform", function (d) {
                                return "translate(" + d.x0 + "," + d.y0 + ")";
                            })
                            .select("rect")
                            .attr("width", function (d) {
                                return d.x1 - d.x0;
                            })
                            .attr("height", function (d) {
                                return d.y1 - d.y0;
                            });
                    }
                });

                function sumByCount(d) {
                    return d.children ? 0 : 1;
                }

                function sumBySize(d) {
                    return d.size;
                }

            }
        },
        computed: {},
        watch: {
            width(data){
                if (data!==null){
                    this.init(data);
                }
            }
        },
        components: {}
    };
</script>

<style scoped>
    text {
        stroke: #fff;
        stroke-width: 1;
        font-size: 20px;

        text-anchor: middle; /* 文本水平居中 */
        dominant-baseline: middle; /* 文本垂直居中 */
    }

    form {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    svg {
        font: 16px sans-serif;
    }

</style>
