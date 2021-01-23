import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "@material-ui/core";

import {
  EventTypes,
  Keywords,
  NodeNames,
  FilterTypes,
  LOCAL_STORAGE_EVENT_NOTES,
} from "../common/consts";
import Colors from "../common/colors";

import Button from "../components/common/DefaultButton";
import Title from "../components/common/Title";
import Header from "../components/common/Header";
import EventTile from "../components/EventTile";
import SearchBar from "../components/SearchBar";

import MultiEventSelectedIcon from "../icons/tasks-solid.svg";
import ActiveEventSelectedIcon from "../icons/hourglass-start-solid.svg";
import FutureEventSelectedIcon from "../icons/fast-forward-solid.svg";
import PastEventSelectedIcon from "../icons/history-solid.svg";
import PermanentEventSelectedIcon from "../icons/infinity-solid.svg";
import MultiEventUnselectedIcon from "../icons/tasks-grey.svg";
import ActiveEventUnselectedIcon from "../icons/hourglass-start-grey.svg";
import FutureEventUnselectedIcon from "../icons/fast-forward-grey.svg";
import PastEventUnselectedIcon from "../icons/history-grey.svg";
import PermanentEventUnselectedIcon from "../icons/infinity-grey.svg";

const HTMLQuickValidate = (str) => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

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

  if (
    !filteredDate.match(/[1-9]{1,2}/g) ||
    !filteredDate.match(/[1-9]{1,2}/g).length
  ) {
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

/**
 *
 * @param {HTML} body
 * @param {Date} patchNodesTimeStamp
 */

const handleSubSectionNews = (body, patchNodesTimeStamp) => {
  const sectionDetails = [];
  const eventHeadersList = Array.from(body.querySelectorAll("h3"));

  eventHeadersList.forEach((eventHeader, i) => {
    sectionDetails.push({
      orderId: i,
      eventName: eventHeader.textContent,
      requirements: [],
      details: "",
      rewards: "",
      rewardImages: [],
      eventType: null,
      eventTimes: [],
      pinned: false,
      pinId: -1,
    });

    let hasReward = false;
    let element = eventHeader.nextElementSibling;
    const lastSectionDetail = sectionDetails[sectionDetails.length - 1];
    while (
      element &&
      element.nodeName !== NodeNames.H1 &&
      element.nodeName !== NodeNames.H3
    ) {
      // details inbetween
      // TODO: not all details are working properly (i.e. maplehood watch)
      const innerText = element.innerText;
      if (element.nodeName === NodeNames.P) {
        const isRewardsIMG = element.childNodes[0].nodeName === NodeNames.IMG;
        // either event duration or requirements
        if (innerText.includes(Keywords.DATES)) {
          // event duration
          const unfilteredDate = innerText.split(/-|–/g);
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
        if (innerText.includes(Keywords.REQUIREMENTS)) {
          lastSectionDetail.requirements += innerText.split(":")[1];
        }
        if (innerText.includes(Keywords.REWARDS)) {
          hasReward = true;
        }
        if (isRewardsIMG && hasReward) {
          lastSectionDetail.rewardImages.push(element.childNodes[0].src);
        }
      }

      if (element.nodeName === NodeNames.UL) {
        // reward details
        if (hasReward) {
          lastSectionDetail.rewards += element.innerHTML;
        } else {
          lastSectionDetail.details += element.innerHTML;
        }
      }

      element = element.nextElementSibling;
    }
  });

  // convert the leftover NULL event types to PATCH
  return sectionDetails.map((section) => {
    if (!section.eventTimes.length) {
      section.eventType = EventTypes.PATCH;
    }
    return section;
  });
};

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      isModalActive: false,
      filterValue: "",
      modalInputText: null,
      newsDetails: {
        backupBanner: process.env.PUBLIC_URL + "/testbanner.png",
        bannerURL: null,
        patchNodesTimeStamp: null,
        sectionDetails: [],
      },
      filters: {
        [FilterTypes.MULTIPLE_EVENTS]: false,
        [FilterTypes.UPDATES_PATCHES]: false,
        [FilterTypes.ACTIVE_EVENTS]: false,
        [FilterTypes.PAST_EVENTS]: false,
        [FilterTypes.FUTURE_EVENTS]: false,
      },
      filterPills: [
        {
          name: "updatesAndPatches",
          tooltip: "Updates and Patches",
          selectedIcon: PermanentEventSelectedIcon,
          deselectedIcon: PermanentEventUnselectedIcon,
          filterType: FilterTypes.UPDATES_PATCHES,
          isActive: false,
          callback: this.handleFilterToggle.bind(this),
        },
        {
          name: "activeEvents",
          tooltip: "Active Events",
          selectedIcon: ActiveEventSelectedIcon,
          deselectedIcon: ActiveEventUnselectedIcon,
          filterType: FilterTypes.ACTIVE_EVENTS,
          isActive: false,
          callback: this.handleFilterToggle.bind(this),
        },
        {
          name: "multiEvents",
          tooltip: "Multiple Events",
          selectedIcon: MultiEventSelectedIcon,
          deselectedIcon: MultiEventUnselectedIcon,
          filterType: FilterTypes.MULTIPLE_EVENTS,
          isActive: false,
          callback: this.handleFilterToggle.bind(this),
        },
        {
          name: "futureEvents",
          tooltip: "Future Events",
          selectedIcon: FutureEventSelectedIcon,
          deselectedIcon: FutureEventUnselectedIcon,
          filterType: FilterTypes.FUTURE_EVENTS,
          isActive: false,
          callback: this.handleFilterToggle.bind(this),
        },
        {
          name: "pastEvents",
          tooltip: "Past Events",
          selectedIcon: PastEventSelectedIcon,
          deselectedIcon: PastEventUnselectedIcon,
          filterType: FilterTypes.PAST_EVENTS,
          isActive: false,
          callback: this.handleFilterToggle.bind(this),
        },
      ],
    };
    this.newsRef = React.createRef();
  }

  componentDidMount() {
    const newsDetails = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_EVENT_NOTES)
    );
    if (newsDetails) {
      this.setState({
        ...this.state,
        newsDetails,
      });
    }
  }

  handleFilterToggle(filterType) {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        [filterType]: !this.state.filters[filterType],
      },
    });
    this.handleEventTileRender();
  }

  openModal() {
    this.setState({ isModalActive: true });
  }

  closeModal() {
    this.setState({ isModalActive: false });
  }

  // TODO: think about loading state?
  handleModalInputChange(ev) {
    if (HTMLQuickValidate(ev.target.value)) {
      this.getNews(ev.target.value);
      this.setState({
        isModalActive: false,
      });
    } else {
      alert(
        "The source code is not valid and cannot be parsed.\nPlease try again."
      );
      ev.target.value = "";
    }
  }

  handleEventTileRender() {
    const { filterValue, filters } = this.state;
    const { sectionDetails } = this.state.newsDetails ?? [];
    const filterKeys = Object.keys(filters);
    const isFilterActive = !!filterKeys.filter((key) => filters[key]).length;

    if (!sectionDetails || !sectionDetails.length) {
      return (
        <EventEmptyIntro>
          No Events found, click <b>UPDATE NEWS HUB</b> above to get started!
        </EventEmptyIntro>
      );
    }

    return sectionDetails.map((section, i) => (
      <EventTile
        key={i}
        eventDetails={section}
        filterValue={filterValue}
        isFilterActive={isFilterActive}
        filters={filters}
      />
    ));
  }

  // TODO: find count of subsections (count of h3s) and render placeholders?
  getNews(patchNotesSrc = "") {
    // convert to mobx? (loading state)
    const doc = new DOMParser().parseFromString(patchNotesSrc, "text/html");
    const body = doc.querySelector("div.article-content");
    const banner = body.querySelector("img#__mcenew");
    const patchNodesTimeStamp = Date.parse(
      doc.querySelector(".timestamp").innerText
    );
    const sectionDetails = handleSubSectionNews(body, patchNodesTimeStamp);
    this.setState(
      {
        newsDetails: {
          ...this.state.newsDetails,
          bannerURL: banner.attributes.src.textContent,
          sectionDetails,
          patchNodesTimeStamp,
        },
      },
      () => {
        window.localStorage.setItem(
          LOCAL_STORAGE_EVENT_NOTES,
          JSON.stringify(this.state.newsDetails)
        );
      }
    );
  }

  renderHeader() {
    const { newsDetails } = this.state;
    const src = newsDetails.bannerURL ?? newsDetails.backupBanner;
    return (
      <Header src={src}>
        <Title
          title='All-In-One News Hub'
          caption='Click the button below if the News Hub is not updated!'
        />
        <Button label='Update News Hub' callback={this.openModal.bind(this)} />
        <Modal
          open={this.state.isModalActive}
          onClose={this.closeModal.bind(this)}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
        >
          <ModalContainer>
            <div>
              <h2>Steps:</h2>
              <ol>
                <li>Open patch notes</li>
                <li>
                  Right click anywhere on the page and select 'View Page Source'
                </li>
                <li>Copy the entire page (Ctrl + A) and paste below!</li>
              </ol>
            </div>

            <ModalTextArea onChange={this.handleModalInputChange.bind(this)} />
          </ModalContainer>
        </Modal>
      </Header>
    );
  }

  handleSearchResults(filterValue) {
    this.setState({
      ...this.state,
      filterValue,
    });
  }

  render() {
    const { patchNodesTimeStamp, sectionDetails } = this.state.newsDetails;
    return (
      <>
        {this.renderHeader()}
        <NewsContainer>
          <LastUpdatedHeader>
            <b>Patch Notes Last Updated On: </b>
            {new Date(patchNodesTimeStamp).toDateString()}
          </LastUpdatedHeader>
          <SearchBar
            searchObject={sectionDetails}
            callback={this.handleSearchResults.bind(this)}
            filterPills={this.state.filterPills}
          />
          <TileContainer ref={this.newsRef}>
            {this.handleEventTileRender()}
          </TileContainer>
        </NewsContainer>
      </>
    );
  }
}

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 600px;
  height: 300px;
  padding: 8px 0;
  outline: none;
  background: ${Colors.White};
  border-radius: 5px;

  li {
    margin: 4px 0;
  }
`;

const ModalTextArea = styled.textarea`
  width: 400px;
  height: 300px;
  background: ${Colors.White};
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
  margin: 0 auto;
  width: 100%;
`;

const EventEmptyIntro = styled.p`
  margin: 32px 16px;
`;
