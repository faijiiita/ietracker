"use client";

import { UpdateUserCurrency } from "@/app/wizard/_actions/user-settings";
import { useMediaQuery } from "@/hooks/use-media-query";
import { currencies, Currency } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const CurrencyList = ({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrency: (currency: Currency | null) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Filter Currency..." />
      <CommandList>
        <CommandEmpty>No Result Found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrency(
                  currencies.find((curr) => curr.value === value) || null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const CurrencyCombobox = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = currencies.find(
      (currency) => currency.value === userSettings.data?.currency
    );

    if (userCurrency) setSelectedCurrency(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success("Currency Updated Successfully", {
        id: "update-currency",
      });

      setSelectedCurrency(
        currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Something went Wrong!", {
        id: "update-currency",
      });
    },
  });

  const selectCurrency = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please Select a Currency");
        return;
      }

      toast.loading("Updating Currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedCurrency ? (
                <>{selectedCurrency.label}</>
              ) : (
                <>Set Currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CurrencyList
              setOpen={setOpen}
              setSelectedCurrency={selectCurrency}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedCurrency ? (
              <>{selectedCurrency.label}</>
            ) : (
              <>Set Currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle />
            <DrawerDescription />
          </DrawerHeader>
          <div className="mt-4 border-t">
            <CurrencyList
              setOpen={setOpen}
              setSelectedCurrency={selectCurrency}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
};

export default CurrencyCombobox;
