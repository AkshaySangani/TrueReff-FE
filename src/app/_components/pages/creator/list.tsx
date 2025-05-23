"use client";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import { PiListChecksLight } from "react-icons/pi";
import { IoGridOutline } from "react-icons/io5";
import CreatorTable from "./creator-table";
import Loading from "@/app/vendor/loading";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { debounce } from "lodash";
import Select from "react-select";
import CreatorCard from "./creator-card";
import { formatNumber } from "@/lib/utils/constants";
import CollaborateRequest from "../../components-common/dialogs/collaborate-creator-form";
import SingleSelect from "../../components-common/single-select";
import { ViewToggle } from "../../components-common/view-toggle";
import { SearchInput } from "../../components-common/search-field";
import CreatorFilter from "./creator-filter";
export interface ICategory {
  _id: string;
  name: string;
}

export interface IChannel {
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  token: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
  lastFiveVideoViews: number;
  lastMonthViews: number;
}
export interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sub_category: string[];
  category: ICategory[];
  channels: IChannel[];
  categories?: string;
  tag?: string;
  instagramViews?: string;
  youtubeViews?: string;
  pastSales?: string;
}
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    width: "200px",
    borderRadius: "8px",
  }),
};

export default function CreatorList() {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [creators, setCreators] = useState<ICreator[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const initialValue = { show: false, creatorId: "" };
  const [isOpen, setIsOpen] = useState(initialValue);
  const [pageSize] = useState(20);
  const filterOption = [
    { value: "5", label: "Last 5 Videos" },
    { value: "30", label: "Last 1 Month" },
  ];

  const getInstagramView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let instagram = channels.find(
      (ele: { channelType: string }) => ele.channelType === "instagram"
    );
    return "";
  };
  const getYoutubeView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let youtube = channels.find(
      (ele: { channelType: string }) => ele.channelType === "youtube"
    );
    return youtube
      ? formatNumber(
          filter === "5" ? youtube?.lastFiveVideoViews : youtube?.lastMonthViews
        )
      : "-";
  };
  // Get Creator list
  const getCreatorList = useCallback(
    async (
      page: number,
      isInternalLoader?: boolean,
      searchValue: string = "",
      filterState?: any
    ) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        const response = await axios.get(
          `/auth/creator/list?page=${page}&limit=${pageSize}${
            searchValue ? `&search=${searchValue}` : ""
          }${filterState?.state ? `&state=${filterState?.state}` : ""}${
            filterState?.city ? `&city=${filterState?.city}` : ""
          }`
        );
        if (response.status === 200) {
          const creatorData = response.data.data;
          if (creatorData && typeof creatorData === "object") {
            const creatorsArray = creatorData.list || [];
            const creatorsCount = creatorData.count || 0;

            if (Array.isArray(creatorsArray)) {
              let result = creatorsArray.map((ele: ICreator) => {
                ele.categories = ele.category
                  ?.map((ele: { name: string }) => ele?.name)
                  .join(",");
                ele.tag = ele.tags?.join(",");
                ele.instagramViews = getInstagramView(ele.channels);
                ele.youtubeViews = getYoutubeView(ele.channels);
                //@ts-ignore
                ele.pastSales = ele?.pastSales || "";
                return { ...ele };
              });
              setCreators([...result]);
              setTotalPages(Math.ceil(creatorsCount / pageSize));
            } else {
              setCreators([]);
              setCurrentPage(1);
            }
            setLoading(false);
            setInternalLoader(false);
          } else {
            setCreators([]);
            setCurrentPage(1);
            setLoading(false);
            setInternalLoader(false);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
        setInternalLoader(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    getCreatorList(currentPage);
  }, []);
  const handlePageChange = (page: number) => {
    page !== currentPage && getCreatorList(page, true, search);
  };
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      getCreatorList(1, true, value);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    debouncedSearch(value);
    setSearch(value);
  };
  const handleOnFilter = (filterState: any) => {
    getCreatorList(1, true, search, filterState);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_creator")}
            />
            <div className="flex items-center gap-[10px] md:w-fit w-full">
              <CreatorFilter onChange={handleOnFilter} />
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          {creators?.length > 0 ? (
            <>
              {viewMode === "table" && (
                <CreatorTable
                  data={creators}
                  filter={filter}
                  loader={internalLoader}
                  handleCollaborateNow={(creatorId: string) => {
                    setIsOpen({ show: true, creatorId });
                  }}
                />
              )}
              {viewMode === "card" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 h-full bg-white p-4 rounded-[20px] overflow-auto">
                  {creators.map((item: any, i) => (
                    <div key={i} className="flex h-fit w-full">
                      <CreatorCard
                        item={item}
                        handleCollaborateNow={(creatorId: string) => {
                          setIsOpen({ show: true, creatorId });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <EmptyPlaceHolder
              title={translate("No_Creators_Available_Title")}
              description={translate("No_Creators_Available_Description")}
            />
          )}
        </>
      )}
      {isOpen?.show && (
        <CollaborateRequest
          open={isOpen?.show}
          onClose={() => {
            setIsOpen(initialValue);
          }}
          creatorId={isOpen?.creatorId}
        />
      )}
    </div>
  );
}
