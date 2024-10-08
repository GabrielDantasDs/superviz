"use client";

import React from "react";
import { List as ListInterface } from "../interfaces/types";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
const CardClosed = dynamic(import("@/components/CardClosed"));

interface ListProps {
	data: ListInterface;
}

export default function ListClosed({ data }: ListProps) {
	const dispatch = useDispatch();

	return (
		<div
			className="w-96 p-4 mb-8 flex-shrink-0 bg-slate-200 .list"
		>
			<div
				className="bg-white shadow-lg rounded-lg overflow-hidden mb-4"
			>
				<div className="px-4 py-2 flex">
					<h2 className="text-xl font-bold text-gray-800">
						{data.header.title}
					</h2>
				</div>
			</div>

			<div className="min-height-width">
				{data.cards.map((card, index) => {
					return (
						<CardClosed
							id={card.id}
							id_list={card.id_list}
							key={card.id}
							position={card.position}
							title={card.title}
							content={card.content}
							tags={card.tags}
							tasks={card.tasks}
							id_user={card.id_user}
						/>
					);
				})}
			</div>
		</div>
	);
}
