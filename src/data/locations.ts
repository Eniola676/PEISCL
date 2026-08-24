export type LocationId = "kubwa" | "jabi" | "virtual";

export interface Location {
  id: LocationId;
  name: string;
  address: string;
  type: "physical" | "virtual";
}

export const locations: Record<LocationId, Location> = {
  kubwa: {
    id: "kubwa",
    name: "Kubwa Campus",
    address: "8 Unity Close, off Arab Road, Kubwa, Abuja",
    type: "physical",
  },
  jabi: {
    id: "jabi",
    name: "Jabi Campus",
    address: "Plot 359 Ebitu Ukiwe Crescent, Jabi, Abuja",
    type: "physical",
  },
  virtual: {
    id: "virtual",
    name: "Virtual / Online",
    address: "Live online sessions",
    type: "virtual",
  },
};

export const allLocationIds: LocationId[] = ["kubwa", "jabi", "virtual"];

export const formatLocationSummary = (ids: LocationId[]) =>
  ids.map((id) => locations[id].name.replace(" Campus", "")).join(" • ");
