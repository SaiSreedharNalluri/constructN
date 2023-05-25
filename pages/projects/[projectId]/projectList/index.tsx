import { ProjectListing } from "../../../../components/divami_components/project-listing/ProjectListing";
import { useEffect, useState } from "react";
import Header from "../../../../components/divami_components/header/Header";
import SidePanelMenu from "../../../../components/divami_components/side-panel/SidePanel";
import { UsersListing } from "../../../../components/divami_components/usersList/UsersListing";
import { Content, ProjectsListContainer } from "../usersList/usersListStyles";
import { InputAdornment } from "@mui/material";
import CustomButton from "../../../../components/divami_components/custom-button/CustomButton";
import {
  TableHeader,
  HeaderActions,
  HeaderImage,
  GridViewButton,
  ListViewButton,
  ToggleButtonContainer,
  GridButton,
  HeaderLabel,
  ProjectsHeader,
  GridViewButtonRight,
} from "../../../../components/divami_components/project-users-list/ProjectUsersListStyles";
import {
  SearchAreaContainer,
  CustomSearchField,
  CloseIcon,
} from "../sections/SectionsStyles";
import { useRouter } from "next/router";
import SearchBoxIcon from "../../../../public/divami_icons/search.svg";
import Image from "next/image";
import CrossIcon from "../../../../public/divami_icons/crossIcon.svg";
import searchIcon from "../../../../public/divami_icons/search.svg";
import UserFilterIcon from "../../../../public/divami_icons/UserFilterIcon.svg";
import selectGridViewIcon from "../../../../public/divami_icons/gridViewicon.svg";
import updatedIcon from "../../../../public/divami_icons/updatedAtIcon.svg";
import sortIcon from "../../../../public/divami_icons/sortIcon.svg";
import listViewIcon from "../../../../public/divami_icons/listViewicon.svg";
import { ProjectCardsContainer } from "../../../../components/divami_components/project-listing/ProjectListingStyles";
import { ProjectListCardView } from "../../../../components/divami_components/project-listing/ProjectListCardView";
import { ProjectListFlatView } from "../../../../components/divami_components/project-listing/ProjectListFlatView";
import moment from "moment";
import { getProjectsList } from "../../../../services/project";
import unselectGridIcon from "../../../../public/divami_icons/unselectGridIcon.svg";
import selectListIcon from "../../../../public/divami_icons/selectListIcon.svg";

const Index: React.FC<any> = () => {
  const breadCrumbsData = [{ label: "Manage Users" }];
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [tableData, setTableData] = useState<any>([]);
  const router = useRouter();
  const [searchTableData, setSearchTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(true);

  const handleSearchWindow = () => {
    setSearchTableData(tableData);
    if (searchTerm === "") {
      setIsSearching(!isSearching);
    } else {
      setSearchTerm("");
    }
  };
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => {
    if (router.isReady) {
      getProjectsList()
        .then(async (response) => {
          if (response?.data?.success === true) {
            const projectsData = response?.data?.result.map((each: any) => {
              return {
                ...each,
                companyLogo: each.coverPhoto,
                projectName: each.name,
                userName: each.userName,
                numberOfUsers: each.usersCount,
                updatedAt: moment(each.lastUpdated).format("DD MMM YY"),
                capture360Count: each?.captures["360 Image"]
                  ? `${each?.captures["360 Image"]}`
                  : "0",
                captureVideoWalkCount: each?.captures["360 Video"]
                  ? `${each?.captures["360 Video"]}`
                  : "0",
                capturePhoneCount: each?.captures["Phone Image"]
                  ? `${each?.captures["Phone Image"]}`
                  : "0",
                captureLidarCount: each?.captures["LiDAR Scan"]
                  ? `${each?.captures["LiDAR Scan"]}`
                  : "0",
                captureDroneCount: each?.captures["Drone Image"]
                  ? `${each?.captures["Drone Image"]}`
                  : "0",
              };
            });

            setProjects(projectsData);
          }
        })
        .catch((error) => {});
    }
  }, [router.isReady]);
  const formHandler = (event: any) => {};

  return (
    <div className=" w-full  h-full">
      <div className="w-full">
        {!isFullScreen && (
          <Header
            showBreadcrumbs
            breadCrumbData={breadCrumbsData}
            hideSidePanel
          />
        )}

        {/* <Header breadCrumb={getBreadCrumbs()}></Header> */}
      </div>
      <Content>
        {/* <SidePanelMenu onChangeData={() => {}} /> */}
        <ProjectsListContainer>
          <ProjectsHeader>
            <HeaderLabel>Project(s) </HeaderLabel>
            <HeaderActions>
              {isSearching ? (
                <SearchAreaContainer marginRight>
                  <CustomSearchField
                    placeholder="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSearchTableData(
                        tableData.filter((each: any) =>
                          each.fullName.includes(e.target?.value)
                        )
                      );
                    }}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image src={SearchBoxIcon} alt="" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          <CloseIcon
                            onClick={() => {
                              handleSearchWindow();
                            }}
                            src={CrossIcon}
                            alt={"close icon"}
                            data-testid="search-close"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </SearchAreaContainer>
              ) : (
                <HeaderImage
                  src={searchIcon}
                  alt=""
                  width={24}
                  height={24}
                  onClick={() => {
                    setIsSearching(true);
                  }}
                />
              )}
              <HeaderImage
                src={sortIcon}
                alt=""
                width={24}
                height={24}
                onClick={() => {
                  setOpenFilter(true);
                }}
              />
              <HeaderImage
                src={UserFilterIcon}
                alt=""
                width={24}
                height={24}
                onClick={() => {
                  setOpenFilter(true);
                }}
              />
              <ToggleButtonContainer>
                <GridViewButton
                  onClick={() => {
                    setIsGridView(true);
                  }}
                  toggleStatus={isGridView}
                  data-testid="design-button"
                >
                  <GridButton
                    src={isGridView ? selectGridViewIcon : unselectGridIcon}
                    alt=""
                  />
                </GridViewButton>
                <GridViewButtonRight
                  onClick={() => {
                    setIsGridView(false);
                  }}
                  toggleStatus={!isGridView}
                  data-testid="design-button"
                >
                  <GridButton
                    src={isGridView ? listViewIcon : selectListIcon}
                    alt=""
                  />
                </GridViewButtonRight>
              </ToggleButtonContainer>
            </HeaderActions>
          </ProjectsHeader>
          {isGridView ? (
            <ProjectListCardView projects={projects} />
          ) : (
            <ProjectListFlatView projects={projects} />
          )}
        </ProjectsListContainer>
      </Content>
    </div>
  );
};
export default Index;
