defmodule Solver do
  def solve_part_one(filename) do
    lines =
      case File.read(filename) do
        {:ok, body} -> body
        {:error, reason} -> IO.puts(:file.format_error(reason))
      end
      |> String.trim()
      |> String.split("\n")

    {_, zero_hit_count} =
      Enum.reduce(lines, {50, 0}, fn line, {current_click, zero_hit_count} ->
        click_count =
          String.slice(line, 1..(String.length(line) - 1))
          |> String.to_integer()

        loop_range = 0..(click_count - 1)

        new_click_count =
          case String.slice(line, 0..0) do
            "L" ->
              Enum.reduce(loop_range, current_click, fn _, acc ->
                if acc === 0, do: 99, else: acc - 1
              end)

            "R" ->
              Enum.reduce(loop_range, current_click, fn _, acc ->
                if acc === 99, do: 0, else: acc + 1
              end)

            _ ->
              0
          end

        new_zero_count = if new_click_count === 0, do: zero_hit_count + 1, else: zero_hit_count

        {new_click_count, new_zero_count}
      end)

    IO.puts("Part one: #{zero_hit_count}")
  end
end

Solver.solve_part_one("puzzle-input")
