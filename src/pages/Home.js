import React, { Component } from "react";
import Title from "../components/common/Title";
import Button from "../components/common/Button";
import styled from "styled-components";
import { Modal } from "@material-ui/core";

const NodeNames = {
  H1: "H1",
  H3: "H3",
  TEXT: "#text",
  UL: "UL",
  P: "P",
  IMG: "IMG",
};

const Keywords = {
  DATES: "UTC: ",
  REQUIREMENTS: "Requirement:",
  REWARDS: "Reward:",
  PARTS: "Part",
};

Object.freeze(NodeNames);
Object.freeze(Keywords);

const Container = styled.div`
  width: 1024px;
  margin: 0 auto;
  text-align: center;
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

const NewsContainer = styled.div``;

const cleanDateString = (dateString, patchNodesTimeStamp) => {
  const filteredDate = dateString
    .replace("UTC: Available after", "")
    .replace("at", ",")
    .replace("(after maintenance)", "12:00 AM")
    .concat(new Date().getFullYear());
  const filteredDateObject = new Date(filteredDate);
  const timeStamp = Date.parse(filteredDate);
  // TODO: fix the time stamp stuff 
  // if the event start date is 4 months before the patch notes, it must be referring to the following year
  const filteredDateWithYear = filteredDateObject.setYear(
    timeStamp < patchNodesTimeStamp
      ? new Date().getFullYear() + 1
      : new Date().getFullYear()
  );
  // TODO: set date to UTC before returning
  // console.log(new Date(filteredDateWithYear));
  return filteredDateWithYear;
};

const handleSingleEvent = (dateArray, patchNodesTimeStamp) => {
  const [startTime, endTime] = [cleanDateString(dateArray[0], patchNodesTimeStamp), cleanDateString(dateArray[1], patchNodesTimeStamp)];
  console.log(new Date(startTime), new Date(endTime));
};

const handleMultipleEvents = (dateArray, patchNodesTimeStamp) => {};

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
        patchNotesReleaseDate: null,
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
    /** object format for this.state.newsDetails.sectionDetails
     * [
     *    {
     *      orderId: 1,
     *      eventName: '',
     *      startDate: Date(),
     *      duration: Date(),
     *      requirements: '',
     *      details: ''
     *      pinned: boolean [different list for pinned using pinnedId],
     *      pinId: 1
     *    },
     * ]
     */

    const sectionDetails = [];
    const nodeList = Array.from(body.children);
    /**
     * 1. find h3 - boolean 'isNewSection' set as true
     * 2. grab all the following elements
     *
     */

    nodeList.forEach((node, i) => {
      if (node.nodeName === NodeNames.H3) {
        sectionDetails.push({
          orderId: i,
          eventName: node.textContent,
          startDate: "",
          endDate: "",
          requirements: "",
          details: "",
          rewards: "",
          // pinned: false,
          pinId: -1,
        });
      } else if (sectionDetails.length) {
        const lastSectionDetail = sectionDetails[sectionDetails.length - 1];
        let isRewardsIMG = node.childNodes[0].nodeName === NodeNames.IMG;
        // console.log(node);
        if (node.nodeName === NodeNames.UL) {
          lastSectionDetail.details = node.innerHTML;
        }
        if (node.nodeName === NodeNames.P && !isRewardsIMG) {
          // console.log(node.innerText);
          const text = node.innerText;

          if (text.includes(Keywords.DATES)) {
            const unfilteredDate = text.split(/-|–/g);
            const dateCount = unfilteredDate.length;
            // console.log(dateCount)
            // console.log(text);
            /**
             * 3 CASES:
             * 1. no end date [prio: 2]
             * 2. end date [prio: 1]
             * 3. multiple dates [prio: 1]
             */

            switch (dateCount) {
              // no end date
              case 1:
                lastSectionDetail.startDate = cleanDateString(
                  unfilteredDate[0],
                  patchNodesTimeStamp
                );
                lastSectionDetail.endDate = null;
                break;
              // single duration
              case 2:
                // console.log(unfilteredDate);
                handleSingleEvent(unfilteredDate, patchNodesTimeStamp);
                break;
              // multiple dates
              default:
                handleMultipleEvents(unfilteredDate, patchNodesTimeStamp);
                break;
            }
          }
          if (text.includes(Keywords.REQUIREMENTS)) {
            lastSectionDetail.requirements = text.split(":")[1];
            // console.log(lastSectionDetail.requirements);
          }
          if (text.includes(Keywords.REWARDS)) {
          }
        }
      }
    });

    this.setState({
      newsDetails: Object.assign(this.state.newsDetails, sectionDetails),
    });
  }

  handleNewsHTML(body, patchNodesTimeStamp) {
    const banner = body.querySelector("img#__mcenew");
    const newsBySubsection = this.handleSubSectionNews(
      body,
      patchNodesTimeStamp
    );
    this.setState({
      newsDetails: Object.assign(this.state.newsDetails, {
        bannerURL: banner.attributes.src.textContent,
        newsBySubsection,
      }),
    });
  }

  // TODO: check dates of patch notes, and run this only when new patch notes are out
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
    // const targetNode = this.newsRef.current;
    // console.log(body);
    // targetNode.appendChild(body);
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
        <Title
          title="All-In-One News Hub"
          caption="Click the button below if the News Hub is not updated!"
        />
        <Button label="Update News Hub" callback={this.openModal.bind(this)} />
        <Modal
          open={this.state.isModalActive}
          onClose={this.closeModal.bind(this)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {this.renderModalBody()}
        </Modal>
      </Container>
    );
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        <NewsContainer ref={this.newsRef} />
      </>
    );
  }
}
