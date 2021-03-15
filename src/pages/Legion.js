import React, { Component } from "react";
import styled from "styled-components";
import { Stage, Layer, Text, Shape } from "react-konva";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Colors from "../common/colors";

import { LegionClasses } from "../legionUtils/LegionDetails";

export default class Legion extends Component {
  render() {
    return (
      <>
        <Header src={process.env.PUBLIC_URL + "/legionbanner.jpg"}>
          <Title
            title="Legion Board Presets"
            caption="Save you legion presets here to easily switch in game."
          />
        </Header>
        {/* <Container>
          <LegionNav />
          <LegionContainer></LegionContainer>
        </Container> */}
        <Container>
          <Stage width={1024} height={500}>
            <Layer>
              {/*   TODO: drawout legion grid here so we can 
              filter ranks easily without effecting the actual DnD? */}
            </Layer>
            <Layer>
              {LegionClasses.map((legionClass) => {
                if (!legionClass.points || !legionClass.color) {
                  return null;
                }
                return (
                  <>
                    <Text
                      text={legionClass.text}
                      fontFamily="Maplestory"
                      fontSize={16}
                      x={legionClass.textPosition[0]}
                      y={legionClass.textPosition[1]}
                      verticalAlign={"center"}
                    />
                    <Shape
                      sceneFunc={(context, shape) => {
                        context.beginPath();
                        legionClass.points.forEach((point) => {
                          context.lineTo(...point);
                        });
                        context.closePath();
                        // (!) Konva specific method, it is very important
                        context.fillStrokeShape(shape);
                      }}
                      fill={Colors.Legion[legionClass.color]}
                      stroke="black"
                      strokeWidth={1}
                      draggable
                    />
                  </>
                );
              })}
            </Layer>
          </Stage>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  margin: 40px auto;
`;
