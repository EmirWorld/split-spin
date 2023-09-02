<script lang="ts">
	import Background from '$lib/assets/images/background.svg';
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
	let competitors: Competitor[] = []
	let newFriendName: string = '';
	let joke: string = '';

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
			element?.classList.add('bg-orange-950');
		});
	};

	const startSpin = async () => {
		await resertState();
		let randomIndex: number = 0;
		await new Promise<void>((resolve) => {
			for (let i = 0; i < competitors.length + 10; i++) {
				randomIndex = Math.floor(Math.random() * competitors.length);
				const currentElement = document.getElementById('competitor-' + randomIndex);
				setTimeout(
					async () => {
						let greenElements = document.querySelectorAll('.bg-green-500');
						greenElements.forEach((element) => {
							element.classList.remove('bg-green-500');
							element.classList.add('bg-orange-950');
						});
						currentElement?.classList.remove('bg-orange-950');
						currentElement?.classList.add('bg-green-500');
						if (i === competitors.length - 1 + 10) {
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
		winnerElement?.classList.remove('bg-orange-950');
		winnerElement?.classList.add('bg-green-500');
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
	<img class="absolute inset-0 z-0 object-cover w-full h-full" src={Background} alt="" />
	{#if winner}
		<div
			class="modal absolute-center {winner &&
				'modal-active'} z-50 bg-orange-800 p-4 flex flex-col items-center justify-center border-4 w-8/12 h-4/6 border-orange-950"
		>
			<button
				on:click={resertState}
				class="absolute w-12 h-12 top-0 text-xl right-0 p-2 text-white"
			>
				×
			</button>
			<h1 class="text-3xl text-center mt-2 leading-9 font-bold font-mono text-white">
				"Congratulations {winner?.name} on your epic Spin and Split victory!
			</h1>
			<p class="text-white mt-6 text-xl font-mono px-14">
				🎉 You spun that wheel like a pro, and now it's time to split the bill like a champ. Don't
				worry; we promise not to calculate your share using a roulette wheel! 😂🍕🍔🍰🍹💸 Enjoy
				your moment of glory and may the odds be ever in your flavor!"
			</p>
		</div>
	{/if}
	<div
		class="game-wrapper z-10 w-6/12 h-3/6 bg-orange-900 outline outline-4 outline-orange-950 bg-opacity-90 shadow-md rounded-md flex"
	>
		<div class="text-center flex-0 flex flex-col p-4 border-orange-950 border-r-4">
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
			<div class="overflow-auto">
				<div class="grid gap-4 grid-cols-2">
					{#if competitors}
						{#each competitors as competitor, index}
							<div
								id={'competitor-' + String(index)}
								class="flex flex-row bg-opacity-75 bg-orange-950 border-orange-950 border-2 overflow-hidden rounded-md justify-between"
							>
								<div class="flex-1 flex items-center space-x-2 text-start px-4">
									<p>{competitor.icon || '␦'}</p>
									<h1 class="text-xl text-white">{competitor.name}</h1>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<button on:click={startSpin} class="btn striped-shadow mt-auto mx-auto mb-4 white">
				<span>Spin</span>
			</button>
		</div>
	</div>
</div>

<style lang="scss">
</style>
