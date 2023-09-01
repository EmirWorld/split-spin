<script lang="ts">
	interface Competitor {
		id: number;
		name: string;
		hasWon: boolean;
		icon: string;
	}

	let options = {
		method: 'GET',
		headers: { 'x-api-key': '04KN1I2tiltlZTuEkB2Fow==nTZAw6hVLgOzLwvi' }
	};
	let winner: Competitor | undefined;
	let competitors = [
		{ id: 1, name: 'John', hasWon: false, icon: '🦹' },
		{ id: 2, name: 'Jane', hasWon: false, icon: '🦹' },
		{ id: 3, name: 'Joe', hasWon: false, icon: '🦹' },
		{ id: 4, name: 'Jill', hasWon: false, icon: '🦹' }
	];
	let newFriendName = '';
	let joke = '';

	$: if (winner === undefined) getJoke();

	const getJoke = async () => {
		const response = await fetch('https://api.api-ninjas.com/v1/jokes?limit=1', options);
		const data = await response.json();
		joke = data[0].joke;
		joke += ' 😂😂🥹';
	};

	const resertState = () => {
		competitors.forEach((competitor) => {
			competitor.hasWon = false;
		});
		winner = undefined;
		const competitorElements = document.querySelectorAll('.bg-green-500');
		competitorElements.forEach((element) => {
			element.classList.remove('bg-green-500');
			element.classList.add('bg-white');
		});
	};

	const spinSplit = async () => {
		resertState();
		let randomIndex: number = 0;
		await new Promise<void>((resolve) => {
			for (let i = 0; i < 15; i++) {
				randomIndex = Math.floor(Math.random() * competitors.length);
				const currentElement = document.getElementById('competitor-' + randomIndex);
				setTimeout(
					async () => {
						let greenElements = document.querySelectorAll('.bg-green-500');
						greenElements.forEach((element) => {
							element.classList.remove('bg-green-500');
							element.classList.add('bg-white');
						});
						currentElement?.classList.add('bg-green-500');
						currentElement?.classList.remove('bg-white');
						if (i === 14) {
							resolve();
						}
					},
					i * 300,
					i
				);
			}
		});

		winner = competitors[randomIndex];
		winner.hasWon = true;
		const winnerElement = document.getElementById('competitor-' + String(randomIndex));
		winnerElement?.classList.add('bg-green-500');
		winnerElement?.classList.remove('bg-white');
	};

	const addFriend = () => {
		if (newFriendName.length >= 3) {
			competitors = [
				...competitors,
				{ id: competitors.length + 1, name: newFriendName, hasWon: false, icon: '🦹' }
			];
			newFriendName = '';
		}
	};
</script>

<div class="h-screen w-full relative flex items-center justify-center">
	{#if winner}
		<div class="absolute-center bg-blue-500 p-4">
			<h1 class="text-xl  mt-2 max-w-xs font-bold font-mono text-white">
				Sorry: {winner.name} but you are the "Winner" 🥹
			</h1>
		</div>
	{/if}
	<div class="w-6/12 h-3/6 bg-white bg-opacity-40 shadow-md rounded-md flex">
		<div class="text-center flex-0 flex flex-col p-4 border-r">
			<h1 class="text-xl font-bold font-mono text-white">Welcome to split and spin</h1>
			<div class="max-w-xs text-white text-xs font-thin font-mono mt-auto">
				<quote>{joke}</quote>
			</div>
			<div class="mt-auto flex space-x-2">
				<input
					bind:value={newFriendName}
					type="text"
					class=" w-full rounded-md p-2"
					placeholder="Add friend"
				/>
				<button on:click={addFriend} class="bg-white text-black rounded-md uppercase font-mono p-2"
					>Add</button
				>
			</div>
		</div>
		<div class="flex-1 p-4 flex flex-col">
			<div class="overflow-scroll">
				<div class="grid gap-4 grid-cols-2">
					{#each competitors as competitor, index}
						<div
							id={'competitor-' + String(index)}
							class="flex flex-row bg-white bg-opacity-75 border overflow-hidden rounded-md justify-between"
						>
							<div class="flex-1 flex items-center space-x-2 text-start px-4">
								<p>{competitor.icon || '␦'}</p>
								<h1 class="text-xl text-gray-600">{competitor.name}</h1>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<button
				on:click={spinSplit}
				class=" font-mono uppercase mt-auto font-bold text-white text-3xl py-4 w-full">Spin</button
			>
		</div>
	</div>
</div>
