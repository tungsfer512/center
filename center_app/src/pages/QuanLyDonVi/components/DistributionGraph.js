import React, { useEffect, useRef, useState } from "react";
import Network from "react-vis-network-graph";
import defaultImg from "./device.jpg";
import { Typography } from "antd";
import devices from "@/services/DonVi/donvi";

const DistributionGraph = () => {
    const graphRef = useRef(null);
    const [data, setData] = useState({ nodes: [], edges: [] });

    useEffect(() => {

        devices.getDistribution().then((res) => {
            const dataGraph = res.data;
            // console.log("==========================", dataGraph);
            setData(dataGraph);
            // setData(data);
        });

    }, []);

    useEffect(() => {
        devices.getDistribution().then((res) => {
            const dataGraph = res.data;
            // console.log("==========================", dataGraph);
            setData(dataGraph);
            // setData(data);
        });
    }, []);

    useEffect(() => {
        const graphInterval = setInterval(() => {
            devices.getDistribution().then((res) => {
                const dataGraph = res.data;
                // console.log("==========================", dataGraph);
                setData(dataGraph);
                // setData(data);
            });
        }, 10000);
        return () => {
            clearInterval(graphInterval);
        };
    }, []);


    const _data = {
        nodes: [
            {
                id: "centerserver",
                label: "Center Server",
                title: "Center Server",
                shape: "circularImage",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_1",
                shape: "circularImage",
                label: "192.168.1.1",
                title: "192.168.1.1",
                image: defaultImg,
                size: 20,
                borderWidth: 5,
                font: {
                    color: "red",
                },
            },
            {
                id: "analyzer_192_168_1_2",
                shape: "circularImage",
                title: "192.168.1.2",
                label: "192.168.1.2",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_3",
                shape: "circularImage",
                title: "192.168.1.3",
                label: "192.168.1.3",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_4",
                shape: "circularImage",
                label: "192.168.1.4",
                title: "192.168.1.4",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_5",
                shape: "circularImage",
                label: "192.168.1.5",
                title: "192.168.1.5",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_6",
                shape: "circularImage",
                label: "192.168.1.6",
                title: "192.168.1.6",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_7",
                shape: "circularImage",
                label: "192.168.1.7",
                title: "192.168.1.7",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_8",
                shape: "circularImage",
                label: "192.168.1.8",
                title: "192.168.1.8",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_9",
                label: "192.168.1.9",
                title: "192.168.1.9",
                shape: "circularImage",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_10",
                label: "192.168.1.10",
                title: "192.168.1.10",
                shape: "circularImage",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_11",
                label: "192.168.1.11",
                title: "192.168.1.11",
                shape: "circularImage",
                image: defaultImg,
                size: 20,
            },
            {
                id: "analyzer_192_168_1_12",
                label: "192.168.1.12",
                title: "192.168.1.12",
                shape: "circularImage",
                image: defaultImg,
                size: 20,
            }
        ],
        edges: [
            { from: "analyzer_192_168_1_1", to: "centerserver", },
            { from: "analyzer_192_168_1_2", to: "centerserver", },
            { from: "analyzer_192_168_1_3", to: "centerserver", },
            { from: "analyzer_192_168_1_4", to: "centerserver", },
            { from: "analyzer_192_168_1_5", to: "centerserver", },
            { from: "analyzer_192_168_1_6", to: "centerserver", },
            { from: "analyzer_192_168_1_7", to: "centerserver", },
            { from: "analyzer_192_168_1_8", to: "centerserver", },
            { from: "analyzer_192_168_1_9", to: "centerserver", },
            { from: "analyzer_192_168_1_10", to: "centerserver", },
            { from: "analyzer_192_168_1_11", to: "centerserver", },
            { from: "analyzer_192_168_1_12", to: "centerserver", },

            { from: "analyzer_192_168_1_1", to: "analyzer_192_168_1_3", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_11", to: "analyzer_192_168_1_4", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_10", to: "analyzer_192_168_1_5", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_6", to: "analyzer_192_168_1_7", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_2", to: "analyzer_192_168_1_9", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_12", to: "analyzer_192_168_1_8", arrows: "to", color: "red", value: 1 },
            { from: "analyzer_192_168_1_2", to: "analyzer_192_168_1_8", arrows: "to", color: "red", value: 1 },
        ]
    };


    const options = {
        interaction: {
            selectable: true,
            hover: true,
        },
        edges: {
            smooth: {
                enabled: true,
                type: "diagonalCross",
                roundness: 0,
            },
            physics: false,
            length: 1000,
            width: 1,
            scaling: {
                max: 3,
                min: 1,
            },
            arrows: "to, from",
            color: "#5C8984",
            value: 0,
        },
        // nodes: {
        //     color: {
        //         border: "red",
        //         hover: {
        //             border: "red",
        //         },
        //         hightlight: {
        //             border: "red",
        //         },
        //     },
        //     borderWidth: 0,
        //     borderWidthSelected: 0,
        //     font: {
        //         color: "white",
        //     },
        // },
        layout: {
            randomSeed: 1000
        },
    };
    function myFunction() {
        console.log("Icon image clicked!");
    }
    const handleNodeClick = (event) => {
        console.log("click event is happened");
        console.log("click event is happened in handlenode click");
        console.log(event);
    };

    return (
        <>
            <Network
                graph={data}
                ref={graphRef}
                options={options}
                events={{
                    click: handleNodeClick,
                    dragEnd: (event) => {
                        console.log("dragEnd Event:", event);
                        // setData(_data)
                    }
                }}
                getNetwork={(network) => {
                    network.on("afterDrawing", (ctx) => {
                        data.nodes.forEach((node) => {
                            const iconImg = new Image();
                            iconImg.src =
                                defaultImg;
                            const nodeId = node.id;
                            const nodePosition = network.getPositions([nodeId])[nodeId];
                            const nodeSize = 20;
                            var setVal = sessionStorage.getItem("set");
                            if (setVal === "yes") {
                                console.log(setVal);
                                ctx.font = "14px Arial";
                                ctx.fillStyle = "#000000";
                                ctx.textAlign = "center";
                                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                                ctx.shadowBlur = 5;
                                ctx.fillStyle = "#ffcc00";
                                ctx.fillRect(
                                    nodePosition.x + nodeSize + 2,
                                    nodePosition.y + nodeSize - 20,
                                    50,
                                    20
                                );
                                ctx.fillText(
                                    node.label,
                                    nodePosition.x,
                                    nodePosition.y + nodeSize + 20
                                );
                                ctx.font = "12px Arial";
                                ctx.color = "black";
                                ctx.fillStyle = "black";
                                ctx.textAlign = "left";
                                ctx.fillText(
                                    nodePosition.x + nodeSize + 5,
                                    nodePosition.y + nodeSize - 5
                                );
                            } else if (setVal === "no") {
                                console.log(setVal);
                                const iconWidth = 20; // width of the icon image
                                const iconHeight = 16;
                                iconImg.src =
                                    defaultImg;
                                ctx.font = "14px Arial";
                                ctx.fillStyle = "#000000";
                                ctx.textAlign = "center";
                                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                                ctx.shadowBlur = 5;
                                ctx.fillStyle = "#ffcc00";
                                ctx.drawImage(
                                    iconImg,
                                    nodePosition.x + nodeSize + 5,
                                    nodePosition.y + nodeSize + 5,
                                    iconWidth,
                                    iconHeight
                                );
                                iconImg.addEventListener("mouseover", myFunction, "false");
                            }
                        });
                    });
                }}
                style={{ display: "flex", height: "40rem" }}
            />
        </>
    );
}

export default DistributionGraph;