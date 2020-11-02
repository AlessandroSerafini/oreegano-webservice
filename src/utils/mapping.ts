import {getNearQuery} from "./query";
import moment = require("moment");

export const getMisteryBoxesWithDistance = async (
    currentLat: number,
    currentLon: number,
    distance: number,
    storeRepository: any,
    misteryBoxRepository: any,
    andFilterClause: any,
    onlyNearMe = false
): Promise<any> => {
    let res: any[] = [];
    const nearMeQuery = getNearQuery("id", "lat", "lon", currentLat, currentLon, "Store", `${onlyNearMe ? `HAVING distance < ${distance}` : ""}`, "distance", "ASC");

    const nearMeStoresIds: any[] = await storeRepository.dataSource.execute(nearMeQuery);
    const misteryBoxStoreFilter: any[] = [];
    if (nearMeStoresIds.length > 0) {
        nearMeStoresIds.forEach((store) => {
            misteryBoxStoreFilter.push({storeId: store.id});
        });

        res = await misteryBoxRepository.find({
            include: [{relation: "store"}],
            where: {
                and: [
                    {or: misteryBoxStoreFilter},
                    andFilterClause,
                    {date: {gte: moment().startOf('day').toDate()}}
                ],
            }
        });

        res = JSON.parse(JSON.stringify(res));
        if (res && res.length > 0) {
            res.forEach((box) => {
                box.distance = nearMeStoresIds.find(x => x.id === box.storeId).distance;
            });
        }

        res.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));

    }
    return res;
}
