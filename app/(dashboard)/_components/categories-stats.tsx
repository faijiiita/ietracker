import SkeletonWrapper from "@/components/skeleton-wrapper";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { GetCategoriesStatsResponseType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import CategoriesCard from "./categories-card";

const CategoriesStats = ({
  userSettings,
  from,
  to,
}: {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "type", "categories", from, to],
    queryFn: () =>
      fetch(`/api/stats/categories?from=${from}&to=${to}`).then((res) =>
        res.json()
      ),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 px-8 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;
