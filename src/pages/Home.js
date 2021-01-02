import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "@material-ui/core";

import { EventTypes, Keywords, NodeNames } from "../common/Consts";

import Button from "../components/common/Button";
import EventTile from "../components/EventTile";
import Title from "../components/common/Title";

const Container = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

const HeaderContainer = styled.div`
  width: 1024px;
  margin: 0 auto;
`;

const Banner = styled.img`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  filter: blur(1.5px) grayscale(1) brightness(0.35);
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1024px;
  height: 300px;
  outline: none;
  background: #d3d3d3;
  border-radius: 5px;
`;

const ModalTextArea = styled.textarea`
  width: 100%;
  height: 100%;
`;

const LastUpdatedHeader = styled.h2`
  font-size: 18px;
  font-weight: normal;
`;

const NewsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin: 32px auto;
  width: 1024px;
`;

const TileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 32px auto;
  width: 100%;
`;

const findYearForEvent = (eventTimeStamp, patchNodesTimeStamp) => {
  const patchNotesDate = new Date(patchNodesTimeStamp);
  // all event dates are assumed to be in current year
  const threeMonthsBeforePatch = patchNotesDate.setMonth(
    patchNotesDate.getMonth() - 3
    );
  const threeMonthsAfterPatch = patchNotesDate.setMonth(
    patchNotesDate.getMonth() + 6
  );
  const yearThreeMonthsBeforePatch = new Date(
    threeMonthsBeforePatch
  ).getFullYear();
  const yearThreeMonthsAfterPatch = new Date(
    threeMonthsAfterPatch
  ).getFullYear();

  if (yearThreeMonthsBeforePatch === yearThreeMonthsAfterPatch) {
    // event period within the same year
    if (eventTimeStamp < threeMonthsBeforePatch) {
      // if event occurs before window: assume next year
      return patchNotesDate.getFullYear() + 1;
    }
    if (eventTimeStamp > threeMonthsBeforePatch) {
      // if event occurs during/after window: assume this year
      return patchNotesDate.getFullYear();
    }
  } else {
    // event period on different years (e.g. sept 2020 -> march 2021)

    if (
      eventTimeStamp > threeMonthsBeforePatch &&
      eventTimeStamp < threeMonthsAfterPatch
    ) {
      // if event occurs during window and month < dec: assume this year
      return yearThreeMonthsBeforePatch;
    }
    if (eventTimeStamp < threeMonthsBeforePatch) {
      // if event occurs after event duration: assume next year
      return yearThreeMonthsAfterPatch;
    }
  }
};

const cleanDateString = (dateString, patchNodesTimeStamp) => {
  if (!dateString.length) {
    return;
  }
  let filteredDate = dateString
    .replaceAll(/\s/g, " ")
    .replaceAll(/part [0-9]+:*\s/gi, "")
    .replaceAll("UTC:", "")
    .replaceAll("Available after", "")
    .replaceAll("during the times listed below.", "")
    .replaceAll("at", "")
    .replaceAll(/\((before|after) maintenance\)/gi, "");

  if (!filteredDate.match(/[1-9]{1,2}/g) || !filteredDate.match(/[1-9]{1,2}/g).length) {
    return;
  }
  filteredDate = filteredDate
    .concat(" " + new Date(patchNodesTimeStamp).getFullYear() + " ")
    .concat("UTC");
  const filteredDateObject = new Date(filteredDate);
  const timeStamp = Date.parse(filteredDate);
  const filteredDateWithYear = filteredDateObject.setYear(
    findYearForEvent(timeStamp, patchNodesTimeStamp)
  );
  return filteredDateWithYear;
};

const handleSingleEvent = (dateArray, patchNodesTimeStamp) => {
  const [startTime, endTime] = [
    cleanDateString(dateArray[0], patchNodesTimeStamp),
    cleanDateString(dateArray[1], patchNodesTimeStamp),
  ];
  return [startTime, endTime];
};

const handleMultipleEvents = (dateArray, patchNodesTimeStamp) => {
  const splitDateArray = dateArray
    .map((dateString) => dateString.split("UTC:"))
    .flat();
  const splitCleanedDateArray = splitDateArray
    .map((date) => cleanDateString(date, patchNodesTimeStamp))
    .filter((date) => date);
  const eventTimes = [];
  splitCleanedDateArray.forEach((event, i) => {
    if (!(i % 2)) {
      // event start timestamp
      eventTimes.push([event]);
    } else {
      // event end timestamp
      eventTimes[eventTimes.length - 1].push(event);
    }
  });
  return eventTimes;
};

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      isModalActive: false,
      // TODO: convert to mobx later?
      modalInputText: window.localStorage.getItem("mapleHubNews"),
      // TODO: break HTML apart -> store the object into localStorage instead
      newsDetails: {
        backupBanner: process.env.PUBLIC_URL + "/testbanner.png",
        bannerURL: "",
        patchNodesTimeStamp: null,
        sectionDetails: [],
      },
    };
    this.newsRef = React.createRef();
  }

  componentDidMount() {
    this.getNews();
  }

  openModal() {
    this.setState({ isModalActive: true });
  }

  closeModal() {
    this.setState({ isModalActive: false });
  }

  handleModalInputChange(ev) {
    this.setState({
      modalInputText: ev.target.value,
    });
    window.localStorage.setItem("mapleHubNews", ev.target.value);
  }

  // ===== HTML UTILITY FUNCTIONS ===== //

  handleSubSectionNews(body, patchNodesTimeStamp) {
    const sectionDetails = [];
    const nodeList = Array.from(body.children);
    nodeList.forEach((node, i) => {
      if (node.nodeName === NodeNames.H3) {
        sectionDetails.push({
          orderId: i,
          eventName: node.textContent,
          requirements: "",
          details: "",
          rewards: "",
          eventType: null,
          eventTimes: [],
          pinned: false,
          pinId: -1,
        });
        return;
      }
      
      if (sectionDetails.length) {
        const lastSectionDetail = sectionDetails[sectionDetails.length - 1];
        // TODO: forgot what isRewardsIMG is...
        const isRewardsIMG = node.childNodes[0].nodeName === NodeNames.IMG;
        if (node.nodeName === NodeNames.UL) {
          lastSectionDetail.details = node.innerHTML;
        }
        if (node.nodeName === NodeNames.P && !isRewardsIMG) {
          const text = node.innerText;
          if (text.includes(Keywords.DATES)) {
            const unfilteredDate = text.split(/-|–/g);
            const dateCount = unfilteredDate.length;
            switch (dateCount) {
              case 1:
                // no end date
                lastSectionDetail.eventType = EventTypes.UPDATE;
                lastSectionDetail.eventTimes = [
                  cleanDateString(unfilteredDate[0], patchNodesTimeStamp),
                  (lastSectionDetail.endDate = null),
                ];
                break;
              case 2:
                // single duration
                lastSectionDetail.eventType = EventTypes.SINGLE_EVENT;
                lastSectionDetail.eventTimes = handleSingleEvent(
                  unfilteredDate,
                  patchNodesTimeStamp
                );
                break;
              default:
                // multiple dates
                lastSectionDetail.eventType = EventTypes.MULTIPLE_EVENTS;
                lastSectionDetail.eventTimes = handleMultipleEvents(
                  unfilteredDate,
                  patchNodesTimeStamp
                );
                break;
            }
          }
          if (text.includes(Keywords.REQUIREMENTS)) {
            lastSectionDetail.requirements = text.split(":")[1];
          }
          if (text.includes(Keywords.REWARDS)) {
            // TODO
          }
        }
      }
    });

    // convert the leftover NULL event types to PATCH
    return sectionDetails.map(section => {
      if (!section.eventTimes.length) {
        section.eventType = EventTypes.PATCH;
      }
      return section;
    });
  }

  handleNewsHTML(body, patchNodesTimeStamp) {
    const banner = body.querySelector("img#__mcenew");
    const sectionDetails = this.handleSubSectionNews(body, patchNodesTimeStamp);
    this.setState({
      newsDetails: {
        ...this.state.newsDetails,
        bannerURL: banner.attributes.src.textContent,
        sectionDetails,
        patchNodesTimeStamp,
      },
    });
  }

  // This function should only be ran when new patch notes are out
  // TODO: find count of subsections (count of h3s) and render placeholders?
  getNews() {
    // convert to mobx? (loading state)
    const newsStringHTML = this.state.modalInputText;
    const doc = new DOMParser().parseFromString(newsStringHTML, "text/html");
    const body = doc.querySelector("div.article-content");
    const patchNodesTimeStamp = Date.parse(
      doc.querySelector(".timestamp").innerText
    );
    this.handleNewsHTML(body, patchNodesTimeStamp);
  }

  // ===================================== //

  renderModalBody() {
    return (
      <ModalContainer>
        <ModalTextArea onChange={this.handleModalInputChange.bind(this)} />
      </ModalContainer>
    );
  }

  renderHeader() {
    const { newsDetails } = this.state;
    return (
      <Container>
        <Banner src={newsDetails.bannerURL} />
        <HeaderContainer>
          <Title
            title='All-In-One News Hub'
            caption='Click the button below if the News Hub is not updated!'
          />
          <Button
            label='Update News Hub'
            callback={this.openModal.bind(this)}
          />
          <Modal
            open={this.state.isModalActive}
            onClose={this.closeModal.bind(this)}
            aria-labelledby='simple-modal-title'
            aria-describedby='simple-modal-description'
          >
            {this.renderModalBody()}
          </Modal>
        </HeaderContainer>
      </Container>
    );
  }

  render() {
    const { patchNodesTimeStamp, sectionDetails } = this.state.newsDetails;
    return (
      <>
        {this.renderHeader()}
        <NewsContainer>
          <LastUpdatedHeader>
            <b>Patch Notes Last Updated On: </b>
            {"" + new Date(patchNodesTimeStamp).toDateString()}
          </LastUpdatedHeader>
          <TileContainer ref={this.newsRef}>
            {sectionDetails.map((section, i) => (
              <EventTile key={i} eventDetails={section} />
            ))}
          </TileContainer>
        </NewsContainer>
      </>
    );
  }
}
