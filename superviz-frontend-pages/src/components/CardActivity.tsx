import { Card, CardActivity as CardActivityInterface, List } from "@/interfaces/types";


type Props = {
    data: CardActivityInterface;
}

export default function CardActivity({data}:Props) {

	return (
		<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
			<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Card {data.card?.title} moved from position {data.source_position} in {data.source_list?.header.title} to position {data.destination_position} in  to {data.destination_list?.header.title} - {data.created_at}
			</p>
		</div>
	);
}
