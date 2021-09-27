type Fish = {
  swim: VoidFunction;
};

type Bird = {
  fly: { (): void };
};

export function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

const pet = {
  swim() {
    return 'is swimming!';
  },
} as Fish | Bird;
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
